import fs from "node:fs";
const h = fs.readFileSync("state/induwara_page.html", "utf8");
// Where does 'self.__next_f.push' content live and what's in it? Find all occurrences of distinctive train-data strings
const kws = ["Intercity", "Night Mail", "05:30", "Peradeniya", "Nanu Oya", "Haputale", "ticket", "LKR", "Rs "];
for (const kw of kws) {
  const idxs = []; let i = -1;
  while ((i = h.indexOf(kw, i + 1)) >= 0 && idxs.length < 30) idxs.push(i);
  console.log(JSON.stringify(kw), "count:", idxs.length, "first:", idxs.slice(0, 10));
}
// Extract the RSC flight payload: all self.__next_f.push("...") strings concatenated
const parts = [...h.matchAll(/self\.__next_f\.push\((\[[^\]]*\])\)/g)].map(m => m[1]);
console.log("\nflight chunks:", parts.length);
