import fs from "node:fs";
for (const f of ["38nzs6jzdmrnb.js", "2g7b5cd-er8sm.js"]) {
  const t = fs.readFileSync("state/ijs/" + f, "utf8");
  console.log("====", f, "len", t.length);
  const i = t.indexOf("Podi Menike");
  console.log("Podi Menike at", i);
  console.log(t.slice(Math.max(0, i - 1500), i + 500));
  console.log("...");
}
