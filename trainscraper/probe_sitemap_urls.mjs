import fs from "node:fs";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36";

const rowRe = /<td><font color="green"><strong>([^<]+)<\/strong><\/font><\/td>\s*<td><font color="red"><strong>([^<]+)<\/strong><\/font><\/td>\s*<td>([^<]*)<\/td>\s*<td>([^<]*)<\/td>\s*<td><a[^>]*id="([^"]*)"[^>]*href="([^"]*)"[^>]*>[^<]*<\/a><\/td>\s*<td class="train-type-column">([^<]*)<\/td>/g;
function parse(html) {
  const rows = []; let m; rowRe.lastIndex = 0;
  while ((m = rowRe.exec(html))) rows.push({ dep: m[1].trim(), arr: m[2].trim(), dur: m[3].trim(), endsAt: m[4].trim(), trainNo: m[5].trim(), stopsHref: m[6], type: m[7].trim() });
  return rows;
}

const urls = [
  "https://trainschedule.lk/schedule/abuiaea/colombo-fort-to-kandy-train-timetable",
  "https://trainschedule.lk/schedule/abuiaea/x",
  "https://trainschedule.lk/schedule/aeamuba/kandy-to-colombo-fort-train-timetable",
  "https://trainschedule.lk/schedule/ah7g5ca/polgahawela-to-hatton-train-timetable",
  "https://trainschedule.lk/schedule/abug5ca/colombo-fort-to-hatton-train-timetable",
  "https://trainschedule.lk/schedule/aeaq2aa/kandy-to-badulla-train-timetable",
  "https://trainschedule.lk/schedule/abua8ba/colombo-fort-to-ella-train-timetable",
];
for (const u of urls) {
  const r = await fetch(u, { headers: { "user-agent": UA } });
  const html = await r.text();
  const rows = parse(html);
  console.log(`${r.status} len=${String(html.length).padEnd(6)} rows=${String(rows.length).padEnd(3)} ${u}`);
  if (rows.length) console.log("   ", rows.slice(0, 3).map(x => `${x.trainNo} ${x.dep}->${x.arr} ends=${x.endsAt}`).join(" | "));
  // any other hints: look for "No train" text
  const nt = html.match(/No [Tt]rain[^<]*/g);
  if (nt) console.log("   notice:", nt.slice(0, 2));
}

// full sitemap
const sm = await (await fetch("https://trainschedule.lk/sitemap.xml", { headers: { "user-agent": UA } })).text();
const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
console.log("\nsitemap entries:", locs.length);
const sched = locs.filter(l => l.includes("/schedule/"));
const stat = locs.filter(l => l.includes("/station/"));
const stops = locs.filter(l => l.includes("/stops/"));
console.log("schedule:", sched.length, "station:", stat.length, "stops:", stops.length);
fs.writeFileSync("sitemap.txt", locs.join("\n"));
console.log("\nnon-schedule/station urls:", locs.filter(l => !l.includes("/schedule/") && !l.includes("/station/") && !l.includes("/stops/")).join("\n"));
