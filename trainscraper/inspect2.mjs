import fs from "node:fs";
const t = fs.readFileSync("state/ijs/2g7b5cd-er8sm.js", "utf8");
// Show structure: find the start of the dataset array and station map
const i = t.indexOf('number:"1001"');
console.log("=== before first train (3000 chars) ===");
console.log(t.slice(Math.max(0, i - 3000), i + 50));
