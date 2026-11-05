import fs from "node:fs";
const html = fs.readFileSync("state/induwara_page.html", "utf8");
const srcs = [...html.matchAll(/<script[^>]*src="(\/_next\/static\/chunks\/[^"]+)"/g)].map(m => m[1]);
fs.mkdirSync("state/ijs", { recursive: true });
const results = [];
for (const s of srcs) {
  try {
    const r = await fetch("https://induwara.lk" + s, { headers: { "user-agent": "Mozilla/5.0" } });
    const t = await r.text();
    const name = s.split("/").pop();
    fs.writeFileSync("state/ijs/" + name, t);
    const hasTrain = /Podi Menike|Udarata Menike|Yal Devi/.test(t);
    const hasStop = /arrival|departure|stops/.test(t);
    results.push({ name, len: t.length, hasTrain, hasStop, status: r.status });
  } catch (e) { results.push({ s, err: String(e) }); }
}
console.table(results);
