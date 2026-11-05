import fs from "node:fs";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36";

async function fetchStops(href) {
  const r = await fetch("https://trainschedule.lk" + href, { headers: { "user-agent": UA } });
  const t = await r.text();
  const m = t.match(/var stationsData = (\[[\s\S]*?\]);/);
  return { status: r.status, len: t.length, data: m ? m[1] : null, html: t };
}

// consistency check: same URL 3x
for (let i = 0; i < 3; i++) {
  const res = await fetchStops("/stops/abhabeaat/beliaththa-to-anuradhapura-train-stops");
  console.log(`attempt ${i}: status=${res.status} htmlLen=${res.len} dataLen=${res.data ? res.data.length : "EMPTY"}`);
}

const res = await fetchStops("/stops/abhabeaat/beliaththa-to-anuradhapura-train-stops");
if (!res.data) { console.log("no data"); process.exit(1); }
const arr = JSON.parse(res.data);
console.log("\nentries:", arr.length);
console.log("keys:", Object.keys(arr[0]).join(", "));
console.log("\nfirst entry:", JSON.stringify(arr[0], null, 1));
console.log("\nlast entry:", JSON.stringify(arr[arr.length - 1], null, 1));
console.log("\nall entries summary:");
for (const e of arr) console.log("  ", JSON.stringify(e).slice(0, 400));
fs.writeFileSync("stopsdata_sample.json", JSON.stringify(arr, null, 1));
