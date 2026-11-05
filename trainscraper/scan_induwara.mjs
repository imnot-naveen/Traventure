import fs from "node:fs";
const h = fs.readFileSync("state/induwara_page.html", "utf8");
const kws = ['"origin', '"stops', '"trains', '"code":"', 'trainNumber', '"no":', '"name":"Podi', 'services', '"dep', '"arr', 'schedule', '"from"', '"to"', '"duration"', '"classes"', '"days"'];
for (const kw of kws) {
  const idxs = []; let i = -1;
  while ((i = h.indexOf(kw, i + 1)) >= 0 && idxs.length < 6) idxs.push(i);
  console.log(JSON.stringify(kw), "->", JSON.stringify(idxs));
}
