import fs from "node:fs";
const t = fs.readFileSync("stops_sample_abhabeaat.html", "utf8");
const scripts = [...t.matchAll(/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]).filter(s => s.trim());
scripts.forEach((s, i) => console.log(`=== inline script ${i} len ${s.length} ===\n${s.slice(0, 4000)}\n`));
const srcs = [...t.matchAll(/<script[^>]*src="([^"]+)"/g)].map(m => m[1]);
console.log("script srcs:", srcs);
// look for any json-ish data or fetch/ajax
for (const kw of ["fetch(", "$.ajax", "XMLHttpRequest", "stops", "coordinates", "lat", "circle-container"]) {
  const c = (t.match(new RegExp(kw.replace(/[().]/g, "\\$&"), "g")) || []).length;
  console.log(`kw ${kw}: ${c}`);
}
