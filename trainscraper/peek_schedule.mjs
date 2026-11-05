const UA = "Mozilla/5.0";
const r = await fetch("https://trainschedule.lk/schedule/abuglca/x", { headers: { "user-agent": UA } });
const h = await r.text();
const i = h.indexOf("Train Type");
console.log("has Train Type:", i > -1, "len", h.length);
const j = h.indexOf("<tbody>");
console.log(h.slice(j, j + 1400));
