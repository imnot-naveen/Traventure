import fs from "node:fs";
import path from "node:path";
const DIR = path.dirname(new URL(import.meta.url).pathname.replace(/^\//, "").replace(/^([A-Za-z]:)/, "$1"));
const pages = JSON.parse(fs.readFileSync(path.join(DIR, "state", "stationpages.json"), "utf8"));
for (const tn of ["7083A", "1527A"]) {
  console.log(`\n===== train ${tn} =====`);
  for (const [pid, p] of Object.entries(pages)) {
    for (const r of p.rows) {
      if (r.trainNo !== tn) continue;
      console.log(`  page ${pid} (${p.name || "?"}): from="${r.from}" to="${r.to}" arr=${r.arrival} dep=${r.departure} days="${r.days}"`);
    }
  }
}
