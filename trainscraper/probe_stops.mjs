import fs from "node:fs";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36";
const s = JSON.parse(fs.readFileSync("state/schedules.json", "utf8"));
const hrefs = [];
for (const v of Object.values(s)) for (const r of (v.rows || [])) if (r.stopsHref && r.stopsHref.split("/")[2].length === 9) hrefs.push(r.stopsHref);
const uniq = [...new Set(hrefs)];
console.log("unique 9-char stops hrefs:", uniq.length);

const sample = [uniq[0], uniq[1], uniq[Math.floor(uniq.length / 2)]];
for (const h of sample) {
  const r = await fetch("https://trainschedule.lk" + h, { headers: { "user-agent": UA } });
  const t = await r.text();
  console.log(`\n=== ${h} status=${r.status} len=${t.length}`);
  const main = t.match(/<main[\s\S]*?<\/main>/);
  const seg = main ? main[0] : t;
  // strip scripts/styles
  const clean = seg.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<style[\s\S]*?<\/style>/g, "");
  console.log(clean.slice(0, 3000).replace(/\s+/g, " "));
  fs.writeFileSync("stops_sample_" + h.split("/")[2] + ".html", t);
}
