import fs from "node:fs";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36";

const rowRe = /<td><font color="green"><strong>([^<]+)<\/strong><\/font><\/td>\s*<td><font color="red"><strong>([^<]+)<\/strong><\/font><\/td>\s*<td>([^<]*)<\/td>\s*<td>([^<]*)<\/td>\s*<td><a[^>]*id="([^"]*)"[^>]*href="([^"]*)"[^>]*>[^<]*<\/a><\/td>\s*<td class="train-type-column">([^<]*)<\/td>/g;
function parse(html) {
  const rows = []; let m; rowRe.lastIndex = 0;
  while ((m = rowRe.exec(html))) rows.push({ dep: m[1].trim(), arr: m[2].trim(), dur: m[3].trim(), endsAt: m[4].trim(), trainNo: m[5].trim(), stopsHref: m[6], type: m[7].trim() });
  return rows;
}

async function search(startId, endId) {
  const body = new URLSearchParams({
    "ScheduleModel.TrainModel.SelectedStartStaionID": String(startId),
    "ScheduleModel.TrainModel.SelectedEndStaionID": endId ? String(endId) : "",
  });
  const r = await fetch("https://trainschedule.lk/Search", {
    method: "POST",
    headers: { "user-agent": UA, "content-type": "application/x-www-form-urlencoded", "accept": "text/html" },
    body,
  });
  const html = await r.text();
  return { status: r.status, html, rows: parse(html) };
}

const tests = [[144, 56], [144, null], [56, 144], [103, 56], [56, 103], [274, 56], [56, 84]];
for (const [a, b] of tests) {
  const res = await search(a, b);
  console.log(`POST /Search start=${a} end=${b}: status=${res.status} len=${res.html.length} rows=${res.rows.length} noData=${res.html.includes("No train schedules found!")}`);
  if (res.rows.length) console.log("   ", res.rows.slice(0, 5).map(r => `${r.trainNo} ${r.dep}->${r.arr} ends=${r.endsAt}`).join(" | "));
  if (a === 144 && b === 56) fs.writeFileSync("probe_search_kandy.html", res.html);
}
