import fs from "node:fs";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36";
const ch = v => v < 26 ? String.fromCharCode(97 + v) : String.fromCharCode(48 + (v - 26));
const decFrom = s => { const a = s.split("").map(c => (c >= "a" && c <= "z") ? c.charCodeAt(0) - 97 : c.charCodeAt(0) - 48 + 26); return a[1] * 36 + a[2]; };
const nameOf = id => (JSON.parse(fs.readFileSync("state/stationmaster.json", "utf8")).find(m => m.id === id) || { name: "?" }).name;

async function getData(code, slug = "x") {
  const r = await fetch(`https://trainschedule.lk/stops/${code}/${slug}`, { headers: { "user-agent": UA } });
  const t = await r.text();
  const m = t.match(/var stationsData = (\[[\s\S]*?\]);/);
  let info = null;
  if (m) {
    try {
      const arr = JSON.parse(m[1]);
      info = { n: arr.length, first: arr[0]?.stationProfileURL, last: arr[arr.length - 1]?.stationProfileURL, trainNo: arr.map(e => e.trainModel?.trainNo).find(Boolean) || null };
    } catch (e) { info = { parseErr: String(e) }; }
  }
  return { status: r.status, len: t.length, dataLen: m ? m[1].length : 0, info, home: t.includes("Stopping Stations") === false };
}

// original: abhabeaat = recId "abh" + from(abe=40) + to(aat=19)
console.log("=== original ===");
console.log(JSON.stringify(await getData("abhabeaat", "beliaththa-to-anuradhapura-train-stops")));

console.log("\n=== recId only / mutated tail ===");
for (const code of ["abh", "abhabeaat", "abhxxxxx", "abhzzzzz", "abhaaaaa", "adqaf0abe", "adq", "adqzzzzz"]) {
  const res = await getData(code);
  console.log(`  ${code}: dataLen=${res.dataLen} ${JSON.stringify(res.info)}`);
}

console.log("\n=== enumerate recId 0..60 (3-char letter-first base36) ===");
let found = 0;
for (let i = 0; i <= 60; i++) {
  const c = ch(Math.floor(i / 1296) % 36) + ch(Math.floor(i / 36) % 36) + ch(i % 36);
  const res = await getData(c);
  if (res.dataLen > 0) { found++; console.log(`  recId=${i} (${c}): stops=${res.info?.n} trainNo=${res.info?.trainNo} ${res.info?.first} -> ${res.info?.last}`); }
}
console.log("found:", found);

// decode all 9-char codes from schedules
const s = JSON.parse(fs.readFileSync("state/schedules.json", "utf8"));
const codes = new Set();
for (const v of Object.values(s)) for (const row of (v.rows || [])) if (row.stopsHref && row.stopsHref.split("/")[2].length === 9) codes.add(row.stopsHref.split("/")[2]);
console.log("\n=== decoded pairs from 9-char codes (sample) ===");
const pairs = {};
for (const c of codes) {
  const f = decFrom(c.slice(3, 6)), t = decFrom(c.slice(6, 9));
  pairs[`${f}-${t}`] = (pairs[`${f}-${t}`] || 0) + 1;
}
console.log("distinct pairs:", Object.keys(pairs).length);
const involvesKandy = Object.keys(pairs).filter(k => k.split("-").includes("144"));
console.log("pairs involving Kandy(144):", involvesKandy.length);
console.log(Object.entries(pairs).sort((a, b) => b[1] - a[1]).slice(0, 15).map(([k, v]) => `${k} (${nameOf(+k.split("-")[0])} -> ${nameOf(+k.split("-")[1])}) x${v}`).join("\n"));
