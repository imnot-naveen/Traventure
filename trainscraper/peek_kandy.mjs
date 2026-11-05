const UA = "Mozilla/5.0";
const ch = v => v < 26 ? String.fromCharCode(97 + v) : String.fromCharCode(48 + (v - 26));
const stationCode = id => { const V = id + 123; return ch(V % 36) + ch(Math.floor(V / 36) % 36) + ch(Math.floor(V / 1296) % 36) + ch((2 * (id % 10)) % 36); };
for (const [id, name] of [[144, "Kandy"], [103, "Hatton"], [274, "Peradeniya"]]) {
  const c = stationCode(id);
  const r = await fetch(`https://trainschedule.lk/station/${c}/x`, { headers: { "user-agent": UA } });
  const h = await r.text();
  const tbl = h.indexOf("train-schedules");
  const trs = (h.match(/<tr>/g) || []).length;
  console.log(`=== ${name} (${c}) status=${r.status} len=${h.length} trs=${trs}`);
  if (tbl > -1) console.log(h.slice(tbl, tbl + 900).replace(/\s+/g, " "));
}
