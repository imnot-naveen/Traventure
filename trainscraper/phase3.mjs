// Phase 3: fetch schedule pages for (a) train route pairs, (b) empty-station x hub pairs.
// Stores full rows into state/schedules.json: { "fromId-toId": { rows:[{dep,arr,dur,endsAt,trainNo,type,stopsHref}] } }
import fs from "node:fs";
import path from "node:path";
import { setTimeout as sleep } from "node:timers/promises";

const BASE = "https://trainschedule.lk";
const DIR = path.dirname(new URL(import.meta.url).pathname.replace(/^\//, "").replace(/^([A-Za-z]:)/, "$1"));
const STATE = path.join(DIR, "state");
const load = (f, d) => { try { return JSON.parse(fs.readFileSync(path.join(STATE, f), "utf8")); } catch { return d; } };
const save = (f, v) => fs.writeFileSync(path.join(STATE, f), JSON.stringify(v));

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36";
const ch = v => v < 26 ? String.fromCharCode(97 + v) : String.fromCharCode(48 + (v - 26));
const encFrom = id => ch(0) + ch(Math.floor(id / 36)) + ch(id % 36);
const encTo = id => ch((2 * (id % 10)) % 36) + ch(id % 36) + ch(Math.floor(id / 36));
const routeCode = (f, t) => encFrom(f) + encTo(t) + "a";
const slugify = s => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const norm = s => (s || "").toLowerCase().replace(/\s+/g, " ").trim();

const master = load("stationmaster.json", []);
const stationPages = load("stationpages.json", {});
const schedules = load("schedules.json", {});
let types = load("traintypes.json", {});
const idByName = {};
for (const m of master) idByName[norm(m.name)] = m.id;
const nameById = Object.fromEntries(master.map(m => [m.id, m.name]));

async function get(url, tries = 4) {
  for (let i = 1; i <= tries; i++) {
    try {
      const r = await fetch(url, { headers: { "user-agent": UA, "accept-language": "en" }, signal: AbortSignal.timeout(30000) });
      if (r.status === 200) return await r.text();
      if (r.status === 404) return null;
      throw new Error("HTTP " + r.status);
    } catch (e) { if (i === tries) throw e; await sleep(1200 * i); }
  }
}

const rowRe = /<td><font color="green"><strong>([^<]+)<\/strong><\/font><\/td>\s*<td><font color="red"><strong>([^<]+)<\/strong><\/font><\/td>\s*<td>([^<]*)<\/td>\s*<td>([^<]*)<\/td>\s*<td><a[^>]*id="([^"]*)"[^>]*href="([^"]*)"[^>]*>[^<]*<\/a><\/td>\s*<td class="train-type-column">([^<]*)<\/td>/g;
function parseSchedule(html) {
  const rows = [];
  let m; rowRe.lastIndex = 0;
  while ((m = rowRe.exec(html))) rows.push({ dep: m[1].trim(), arr: m[2].trim(), dur: m[3].trim(), endsAt: m[4].trim(), trainNo: m[5].trim(), stopsHref: m[6], type: m[7].trim() });
  return rows;
}

// ---- build pair list ----
const pairs = new Map();
const addPair = (f, t, why) => { if (f && t && f !== t) pairs.set(`${f}-${t}`, { f, t, why }); };

// (a) train route pairs from station pages
for (const p of Object.values(stationPages)) {
  for (const r of p.rows) addPair(idByName[norm(r.from)], idByName[norm(r.to)], "route");
}
const routePairCount = pairs.size;

// (b) empty station pages x hub queries (both directions)
const hubs = [56, 144, 285, 19, 182, 209, 79, 38, 347, 127, 294, 28, 208, 103]; // CF, Kandy, Polgahawela, Anuradhapura, Kurunegala, Matara, Galle, Batticaloa, Trincomalee, Jaffna, Puttalam, Badulla, Matale, Hatton
const emptyStations = master.filter(m => { const c = Object.keys(stationPages).find(k => stationPages[k].id === m.id); return c && (stationPages[c].rows || []).length === 0; });
for (const e of emptyStations) for (const h of hubs) { addPair(h, e.id, "empty-in"); addPair(e.id, h, "empty-out"); }

const todo = [...pairs.entries()].filter(([k]) => !schedules[k]);
console.log(`phase3: routePairs=${routePairCount} emptyStations=${emptyStations.length} totalPairs=${pairs.size} todo=${todo.length} (cached=${Object.keys(schedules).length})`);

let done = 0, noSchedule = 0;
let i = 0;
const worker = async () => {
  while (i < todo.length) {
    const [key, p] = todo[i++];
    try {
      const slug = `${slugify(nameById[p.f])}-to-${slugify(nameById[p.t])}-train-timetable`;
      const html = await get(`${BASE}/schedule/${routeCode(p.f, p.t)}/${slug}`);
      if (!html || !html.includes("Train Type")) { noSchedule++; schedules[key] = { rows: [], why: p.why, noSchedule: true }; }
      else {
        const rows = parseSchedule(html);
        schedules[key] = { rows, why: p.why };
        for (const r of rows) if (r.type && r.trainNo) types[r.trainNo] = r.type;
      }
    } catch (e) { schedules[key] = { rows: [], why: p.why, err: String(e) }; }
    done++;
    if (done % 50 === 0) { save("schedules.json", schedules); save("traintypes.json", types); console.log(`${done}/${todo.length} types=${Object.keys(types).length} noSched=${noSchedule}`); }
    await sleep(150);
  }
};
await Promise.all(Array.from({ length: 4 }, worker));
save("schedules.json", schedules);
save("traintypes.json", types);
console.log(`DONE done=${done} scheduleKeys=${Object.keys(schedules).length} types=${Object.keys(types).length} noSchedule=${noSchedule}`);
