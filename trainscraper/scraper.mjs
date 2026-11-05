// trainschedule.lk scraper v2: fetch all391 station pages directly, then train types via schedule pages.
import fs from "node:fs";
import path from "node:path";
import { setTimeout as sleep } from "node:timers/promises";

const BASE = "https://trainschedule.lk";
const DIR = path.dirname(new URL(import.meta.url).pathname.replace(/^\//, "").replace(/^([A-Za-z]:)/, "$1"));
const STATE = path.join(DIR, "state");
fs.mkdirSync(STATE, { recursive: true });
const load = (f, d) => { try { return JSON.parse(fs.readFileSync(path.join(STATE, f), "utf8")); } catch { return d; } };
const save = (f, v) => fs.writeFileSync(path.join(STATE, f), JSON.stringify(v));

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36";
const ch = v => v < 26 ? String.fromCharCode(97 + v) : String.fromCharCode(48 + (v - 26));
const val = c => { const n = c.charCodeAt(0); return n >= 97 ? n - 97 : n - 48 + 26; };
const stationCode = id => { const V = id + 123; return ch(V % 36) + ch(Math.floor(V / 36) % 36) + ch(Math.floor(V / 1296) % 36) + ch((2 * (id % 10)) % 36); };
const encFrom = id => ch(0) + ch(Math.floor(id / 36)) + ch(id % 36);                       // padded base36
const encTo = id => ch((2 * (id % 10)) % 36) + ch(id % 36) + ch(Math.floor(id / 36));      // digit order swapped + check
const routeCode = (f, t) => encFrom(f) + encTo(t) + "a";
const slugify = s => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const master = load("stationmaster.json", []);
let stationPages = load("stationpages.json", {});
let failures = load("failures2.json", []);
let types = load("traintypes.json", {});

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

function parseStationPage(html) {
  const rows = [];
  const rowRe = /<tr>\s*<td>([\s\S]*?)<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>\s*<td>([\s\S]*?)<\/td>\s*<td>([\s\S]*?)<\/td>\s*<td>([\s\S]*?)<\/td>\s*<\/tr>/g;
  let m;
  while ((m = rowRe.exec(html))) {
    const [, route, anchor, days, arr, dep] = m;
    const href = (anchor.match(/href="([^"]+)"/) || [])[1] || "";
    const trainNo = ((anchor.match(/>([^<]+)<\/a>/) || [])[1] || "").trim();
    const parts = route.split(/\s*(?:→|->|&rarr;)\s*/).map(s => (s || "").trim());
    rows.push({ from: parts[0] || "", to: parts[1] || "", trainNo, days: days.trim(), arrival: arr.trim(), departure: dep.trim(), stopsHref: href });
  }
  const title = ((html.match(/<h1>([^<]+)<\/h1>/) || [])[1] || "").trim();
  return { title, rows };
}

async function runPool(items, worker, conc = 4, delay = 150) {
  let i = 0, done = 0;
  const tick = async (w) => {
    while (i < items.length) {
      const item = items[i++];
      try { await worker(item, w); } catch (e) { failures.push({ item, err: String(e) }); }
      done++;
      if (done % 50 === 0) console.log(`progress ${done}/${items.length}`);
      await sleep(delay);
    }
  };
  await Promise.all(Array.from({ length: conc }, (_, w) => tick(w)));
}

// ---- Phase 1: station pages ----
const todo = master.filter(m => !stationPages[stationCode(m.id)]);
console.log(`phase1: ${todo.length} station pages to fetch (${Object.keys(stationPages).done} done)`);
await runPool(todo, async (m) => {
  const code = stationCode(m.id);
  const html = await get(`${BASE}/station/${code}/x-railway-station-timetable`);
  if (!html) { failures.push({ id: m.id, code, err: "404" }); return; }
  const p = parseStationPage(html);
  stationPages[code] = { id: m.id, masterName: m.name, ...p, fetchedAt: Date.now() };
  if (p.rows.length === 0) console.log(`empty page: id=${m.id} ${m.name} (${code}) title="${p.title}"`);
});
save("stationpages.json", stationPages);
console.log(`phase1 done: ${Object.keys(stationPages).length} pages, failures=${failures.length}`);

// ---- Phase 2: train types via schedule pages for unique (from,to) route pairs ----
const idByName = {};
for (const m of master) idByName[m.name.toLowerCase().replace(/\s+/g, " ").trim()] = m.id;
const pairs = new Map(); // "fromId-toId" -> {from,to}
for (const p of Object.values(stationPages)) {
  for (const r of p.rows) {
    const f = idByName[r.from.toLowerCase().replace(/\s+/g, " ").trim()];
    const t = idByName[r.to.toLowerCase().replace(/\s+/g, " ").trim()];
    if (f && t) pairs.set(`${f}-${t}`, { f, t, fn: r.from, tn: r.to });
  }
}
const pairsTodo = [...pairs.values()].filter(p => !p.__done);
console.log(`phase2: ${pairs.size} route pairs, schedule pages to fetch`);
let pi = 0, pdone = 0;
await runPool(pairsTodo, async (p) => {
  const code = routeCode(p.f, p.t);
  const slug = `${slugify(p.fn)}-to-${slugify(p.tn)}-train-timetable`;
  const html = await get(`${BASE}/schedule/${code}/${slug}`);
  if (!html || !html.includes("Train Type")) { failures.push({ pair: `${p.fn}->${p.tn}`, code, err: "no schedule" }); return; }
  // rows: dep | arr | duration | endsAt | trainNo link | type
  const rowRe = /<td><font color="green"><strong>([^<]+)<\/strong><\/font><\/td>\s*<td><font color="red"><strong>([^<]+)<\/strong><\/font><\/td>\s*<td>([^<]*)<\/td>\s*<td>([^<]*)<\/td>\s*<td><a[^>]*id="([^"]*)"[^>]*>[^<]*<\/a><\/td>\s*<td class="train-type-column">([^<]*)<\/td>/g;
  let m, found = 0;
  while ((m = rowRe.exec(html))) { types[m[5]] = m[6].trim(); found++; }
  if (!found) failures.push({ pair: `${p.fn}->${p.tn}`, code, err: "parse0 rows" });
  pdone++;
  if (pdone % 25 === 0) { save("traintypes.json", types); console.log(`phase2 ${pdone}/${pairsTodo.length} types=${Object.keys(types).length}`); }
  await sleep(150);
}, 4, 150);
save("traintypes.json", types);
save("failures2.json", failures);
console.log(`DONE pages=${Object.keys(stationPages).length} types=${Object.keys(types).length} failures=${failures.length}`);
