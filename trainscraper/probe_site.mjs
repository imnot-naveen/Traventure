import fs from "node:fs";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36";
const BASE = "https://trainschedule.lk";

async function get(p) {
  const r = await fetch(BASE + p, { headers: { "user-agent": UA } });
  return { status: r.status, text: await r.text() };
}

const home = await get("/");
console.log("home status", home.status, "len", home.text.length);
const hrefs = [...new Set([...home.text.matchAll(/href="([^"]+)"/g)].map(m => m[1]))];
console.log("HREFS:\n" + hrefs.join("\n"));

for (const p of ["/robots.txt", "/sitemap.xml"]) {
  const r = await get(p);
  console.log(`\n=== ${p} status=${r.status} len=${r.text.length}`);
  console.log(r.text.slice(0, 3000));
}
fs.writeFileSync("probe_home.html", home.text);
