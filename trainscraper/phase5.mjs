// Phase 5: retry stops pages that returned empty arrays (likely throttled).
import fs from "node:fs";
import path from "node:path";
import { setTimeout as sleep } from "node:timers/promises";

const DIR = path.dirname(new URL(import.meta.url).pathname.replace(/^\//, "").replace(/^([A-Za-z]:)/, "$1"));
const STATE = path.join(DIR, "state");
const load = f => JSON.parse(fs.readFileSync(path.join(STATE, f), "utf8"));
const save = (f, v) => fs.writeFileSync(path.join(STATE, f), JSON.stringify(v));
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36";
const dataRe = /var stationsData = (\[[\s\S]*?\]);/;

const stops = load("stops.json");
const todo = Object.entries(stops).filter(([, v]) => v.stops.length === 0 && !v.dead && !v.err);
console.log(`retry: ${todo.length} empty stops pages (non-dead)`);

let i = 0, recovered = 0;
const worker = async () => {
  while (i < todo.length) {
    const [code, v] = todo[i++];
    for (let attempt = 1; attempt <= 4; attempt++) {
      try {
        const r = await fetch("https://trainschedule.lk" + v.href, { headers: { "user-agent": UA }, signal: AbortSignal.timeout(30000) });
        if (r.status === 200) {
          const html = await r.text();
          const m = html.match(dataRe);
          if (m) {
            const arr = JSON.parse(m[1]);
            if (arr.length > 0) { stops[code] = { href: v.href, stops: arr }; recovered++; break; }
          }
        }
      } catch (e) { }
      await sleep(1500 * attempt);
    }
    const n = Object.values(stops).filter(x => x.stops.length > 0).length;
    if (n % 50 === 0) save("stops.json", stops);
    await sleep(400);
  }
};
await Promise.all(Array.from({ length: 3 }, worker));
save("stops.json", stops);
const vals = Object.values(stops);
console.log(`DONE recovered=${recovered} withStops=${vals.filter(v => v.stops.length > 0).length} stillEmpty=${vals.filter(v => v.stops.length === 0 && !v.dead).length} dead=${vals.filter(v => v.dead).length}`);
