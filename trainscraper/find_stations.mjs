import fs from "node:fs";
const t = fs.readFileSync("state/ijs/2g7b5cd-er8sm.js", "utf8");
// search for station definition structures
for (const kw of ['id:"fort"', 'id:"kandy"', '{id:"nanu_oya"', 'nanu_oya"', 'ohiya', 'pattipola']) {
  const idxs = []; let p = -1;
  while ((p = t.indexOf(kw, p + 1)) >= 0 && idxs.length < 6) idxs.push(p);
  console.log(JSON.stringify(kw), "->", idxs);
}
// print around 'ohiya' first hit (likely station list)
const p = t.indexOf("ohiya");
console.log("\n=== context around ohiya ===");
console.log(t.slice(Math.max(0, p - 1200), p + 1200));
