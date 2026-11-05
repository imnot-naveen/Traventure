// Phase 4: fetch all stops pages (9-char codes) -> full ordered stop lists with times.
import fs from "node:fs";
import path from "node:path";
import { setTimeout as sleep } from "node:timers/promises";

const DIR = path.dirname(new URL(import.meta.url).pathname.replace(/^\//, "").replace(/^([A-Za-z]:)/, "$1"));
const STATE = path.join(DIR, "state");
const load = (f, d) => { try { return JSON.parse(fs.readFileSync(path.join(STATE, f), "utf8")); } catch { return d; } };
const save = (f, v) => fs.writeFileSync(path.join(STATE, f), JSON.stringify(v));

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36";

const schedules = load("schedules.json", {});
const stationPages = load("stationpages.json", {});
const done = load("stops.json", {});

const codes = new Map(); // code -> href
for (const v of Object.values(schedules)) for (const r of (v.rows || [])) if (r.stopsHref) codes.set(r.stopsHref.split("/")[2], r.stopsHref);
for (const v of Object.values(stationPages)) for (const r of (v.rows || [])) if (r.stopsHref) codes.set(r.stopsHref.split("/")[2], r.stopsHref);
// only 9-char known to work; keep 7-char too (cheap, may be dead)
const todo = [...codes.entries()].filter(([c]) => !done[c]);
console.log(`phase4: total codes=${codes.size} cached=${Object.keys(done).length} todo=${todo.length}`);

const dataRe = /var stationsData = (\[[\s\S]*?\]);/;

async function get(href, tries = 3) {
  for (let i = 1; i <= tries; i++) {
    try {
      const r = await fetch("https://trainschedule.lk" + href, { headers: { "user-agent": UA }, signal: AbortSignal.timeout(30000) });
      if (r.status !== 200) return { status: r.status };
      const html = await r.text();
      const m = html.match(dataRe);
      if (m) {
        try { return { status: 200, data: JSON.parse(m[1]), htmlLen: html.length }; }
        catch (e) { return { status: 200, parseErr: String(e) }; }
      }
      return { status: 200, noData: true, htmlLen: html.length };
    } catch (e) { if (i === tries) return { err: String(e) }; await sleep(1000 * i); }
  }
}

let i = 0, ok = 0, empty = 0, dead = 0;
const worker = async () => {
  while (i < todo.length) {
    const [code, href] = todo[i++];
    const res = await get(href);
    if (res.data) { done[code] = { href, stops: res.data }; ok++; }
    else if (res.noData) { done[code] = { href, stops: [], dead: true }; dead++; }
    else { done[code] = { href, stops: [], err: res.err || ("HTTP " + res.status) }; }
    if (res.data && res.data.length === 0) empty++;
    const n = Object.keys(done).length;
    if (n % 50 === 0) save("stops.json", done);
    await sleep(120);
  }
};
await Promise.all(Array.from({ length: 6 }, worker));
save("stops.json", done);

const vals = Object.values(done);
const withStops = vals.filter(v => v.stops.length > 0);
console.log(`DONE total=${vals.length} withStops=${withStops.length} emptyArr=${vals.filter(v => v.stops.length === 0 && !v.dead && !v.err).length} dead=${vals.filter(v => v.dead).length} err=${vals.filter(v => v.err).length}`);
console.log("total stop entries:", withStops.reduce((a, v) => a + v.stops.length, 0));
