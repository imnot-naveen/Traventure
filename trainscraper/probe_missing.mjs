import fs from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";

const BASE = "https://trainschedule.lk";
const ch = v => v < 26 ? String.fromCharCode(97 + v) : String.fromCharCode(48 + (v - 26));
const encFrom = id => ch(0) + ch(Math.floor(id / 36)) + ch(id % 36);
const encTo = id => ch((2 * (id % 10)) % 36) + ch(id % 36) + ch(Math.floor(id / 36));
const routeCode = (f, t) => encFrom(f) + encTo(t) + "a";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36";
const master = JSON.parse(fs.readFileSync("state/stationmaster.json", "utf8"));
const nameOf = id => (master.find(m => m.id === id) || { name: "?" }).name;
const pages = JSON.parse(fs.readFileSync("state/stationpages.json", "utf8"));

const empty = master.filter(m => { const c = Object.keys(pages).find(k => pages[k].id === m.id); return c && (pages[c].rows || []).length === 0; });
console.log("EMPTY STATIONS (" + empty.length + "):");
console.log(empty.map(m => `${m.id}:${m.name}`).join(" | "));

// duplicates by name?
const byName = {};
for (const m of master) (byName[m.name.toLowerCase()] ||= []).push(m.id);
console.log("\nname variants (kandy/hatton/peradeniya/matale/gampola/nawalapitiya/kadugannawa/badulla/nanuoya/ella/ella?):");
for (const n of Object.keys(byName)) if (/kandy|hatton|peradeniya|matale|gampola|nawalapitiya|kadugannawa|badulla|nanuoya|ella|nanu oya/.test(n)) console.log("  ", n, byName[n]);

const rowRe = /<td><font color="green"><strong>([^<]+)<\/strong><\/font><\/td>\s*<td><font color="red"><strong>([^<]+)<\/strong><\/font><\/td>\s*<td>([^<]*)<\/td>\s*<td>([^<]*)<\/td>\s*<td><a[^>]*id="([^"]*)"[^>]*href="([^"]*)"[^>]*>[^<]*<\/a><\/td>\s*<td class="train-type-column">([^<]*)<\/td>/g;
async function sched(f, t) {
  const r = await fetch(`${BASE}/schedule/${routeCode(f, t)}/x`, { headers: { "user-agent": UA } });
  const html = await r.text();
  const rows = []; let m; rowRe.lastIndex = 0;
  while ((m = rowRe.exec(html))) rows.push({ trainNo: m[5], dep: m[1], arr: m[2], endsAt: m[4] });
  return { rows, noData: html.includes("No train schedules found!") };
}

console.log("\nKANDY(144) pair sweep:");
for (const o of [56, 206, 298, 285, 182, 19, 79, 209, 103, 238, 28, 83, 360, 221, 13, 172, 301, 347, 127]) {
  const a = await sched(144, o), b = await sched(o, 144);
  console.log(`  144<->${o} (${nameOf(o)}): out=${a.rows.length} in=${b.rows.length}`);
  await sleep(250);
}
console.log("\nHATTON(103) / MATALE(208) / BADULLA(28) sweep:");
for (const [s, others] of [[103, [56, 285, 144, 28, 238]], [208, [56, 144, 285]], [28, [56, 238, 144, 103]]]) {
  for (const o of others) {
    const a = await sched(s, o), b = await sched(o, s);
    console.log(`  ${s}(${nameOf(s)})<->${o}(${nameOf(o)}): out=${a.rows.length} in=${b.rows.length}`);
    await sleep(250);
  }
}

// raw Kandy station page
const code = (() => { const id = 144, V = id + 123; const c4 = ch((2 * (id % 10)) % 36); return ch(V % 36) + ch(Math.floor(V / 36) % 36) + ch(Math.floor(V / 1296) % 36) + c4; })();
const r = await fetch(`${BASE}/station/${code}/kandy`, { headers: { "user-agent": UA } });
const html = await r.text();
fs.writeFileSync("probe_kandy_station.html", html);
console.log(`\nKandy station page status=${r.status} len=${html.length} tr=${(html.match(/<tr/g) || []).length} td=${(html.match(/<td/g) || []).length}`);
console.log("title:", (html.match(/<title>([^<]*)<\/title>/) || [])[1]);
const tb = html.indexOf("<tbody");
console.log("tbody area:", JSON.stringify(html.slice(tb, tb + 600)));
