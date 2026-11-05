import fs from "node:fs";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36";
const rowRe = /<td><font color="green"><strong>([^<]+)<\/strong><\/font><\/td>\s*<td><font color="red"><strong>([^<]+)<\/strong><\/font><\/td>\s*<td>([^<]*)<\/td>\s*<td>([^<]*)<\/td>\s*<td><a[^>]*id="([^"]*)"[^>]*href="([^"]*)"[^>]*>[^<]*<\/a><\/td>\s*<td class="train-type-column">([^<]*)<\/td>/g;
const parse = h => { const r = []; let m; rowRe.lastIndex = 0; while ((m = rowRe.exec(h))) r.push({ dep: m[1], arr: m[2], trainNo: m[5], endsAt: m[4] }); return r; };

const urls = [
  "https://trainschedule.lk/schedule/abuiaea/2026-11-03/colombo-fort-to-kandy-train-timetable",
  "https://trainschedule.lk/schedule/abuiaea/2026-11-04/colombo-fort-to-kandy-train-timetable",
  "https://trainschedule.lk/schedule/abuiaea/2026-12-25/colombo-fort-to-kandy-train-timetable",
  "https://trainschedule.lk/schedule/aeamuba/2026-11-03/kandy-to-colombo-fort-train-timetable",
  "https://trainschedule.lk/schedule/abuecfa/2026-11-03/colombo-fort-to-kurunegala-train-timetable",
];
for (const u of urls) {
  const r = await fetch(u, { headers: { "user-agent": UA } });
  const t = await r.text();
  const rows = parse(t);
  console.log(`${r.status} len=${t.length} rows=${rows.length} noData=${t.includes("No train schedules found")} ${u.split("/schedule/")[1]}`);
  if (rows.length) console.log("   ", rows.slice(0, 3).map(x => `${x.trainNo} ${x.dep} ends=${x.endsAt}`).join(" | "));
}

// Guide / about pages
for (const p of ["/Guide", "/about", "/Home/Contact"]) {
  const r = await fetch("https://trainschedule.lk" + p, { headers: { "user-agent": UA } });
  const t = await r.text();
  fs.writeFileSync("page" + p.replace(/\//g, "_") + ".html", t);
  const links = [...new Set([...t.matchAll(/href='([^']+)'|href="([^"]+)"/g)].map(m => m[1] || m[2]))];
  console.log(`\n${p}: ${r.status} len=${t.length} title=${((t.match(/<title>([^<]*)/) || [])[1] || "")}`);
  console.log("  links:", links.filter(l => !css(l)).join(", "));
}
function css(l) { return /\.(css|js|png|jpg|svg|ico|woff2?|map)(\?|$)/i.test(l); }
