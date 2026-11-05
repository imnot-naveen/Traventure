const UA = "Mozilla/5.0";
async function probe(url) {
  const r = await fetch("https://trainschedule.lk" + url, { headers: { "user-agent": UA } });
  const h = await r.text();
  const stationLinks = [...h.matchAll(/href="(\/station\/[^"]+)"/g)].map(m => m[1]);
  const stopsLinks = [...h.matchAll(/href="(\/stops\/[^"]+)"/g)].map(m => m[1]);
  return { url, status: r.status, len: h.length, stationLinks, stopsSample: stopsLinks.slice(0, 3), stopsCount: stopsLinks.length };
}
const s = await probe("/schedule/abuglca/colombo-fort-to-gampaha-train-timetable");
console.log(JSON.stringify({ url: s.url, stationLinks: s.stationLinks, stopsCount: s.stopsCount, stopsSample: s.stopsSample }, null, 1));
const s2 = await probe("/schedule/ahhcvka/panadura-to-wellawatta-train-timetable");
console.log(JSON.stringify({ url: s2.url, stationLinks: s2.stationLinks, stopsCount: s2.stopsCount }, null, 1));
