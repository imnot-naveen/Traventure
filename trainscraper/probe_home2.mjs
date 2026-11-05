import fs from "node:fs";
const h = fs.readFileSync("probe_home.html", "utf8");
// find button / submit and any JS referencing schedule or station ids
const btns = [...h.matchAll(/<button[\s\S]{0,400}?<\/button>/g)].map(m => m[0]);
console.log("BUTTONS:", btns.length);
btns.forEach(b => console.log("---\n" + b.slice(0, 500)));
// any occurrence of "schedule/" or "routeCode" or "enc"
for (const kw of ["schedule/", "Search", "submit", "location.href", "window.open", "getCode", "btoa", "encodeURIComponent"]) {
  const idxs = [...h.matchAll(new RegExp(kw.replace("/", "\\/"), "g"))].map(m => m.index);
  console.log(`kw=${kw} count=${idxs.length}`);
}
// dump the script block containing the form logic
const scripts = [...h.matchAll(/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]);
scripts.forEach((s, i) => console.log(`\n=== inline script ${i} (len ${s.length}) ===\n` + s.slice(0, 3000)));
