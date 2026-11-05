// Verify station code formula: V = id+123, code = [V%36, floor(V/36), floor(V/1296), 2*(id%10)], alphabet a-z0-9
const ch = v => v < 26 ? String.fromCharCode(97 + v) : String.fromCharCode(48 + (v - 26));
const code = id => { const V = id + 123; return ch(V % 36) + ch(Math.floor(V / 36) % 36) + ch(Math.floor(V / 1296) % 36) + ch((2 * (id % 10)) % 36); };

// known from earlier stops page
const known = { 56: "9eam", 206: "fjam", 61: "efac", 157: "2hao", 369: "ynas", 116: "xgam", 67: "kfao", 114: "vgai", 298: "zlaq", 368: "xnaq", 39: "seas", 49: "2eas", 86: "3fam", 386: "foam", 83: "0fag" };
let ok = 0;
for (const [id, exp] of Object.entries(known)) if (code(+id) === exp) ok++;

// live checks for ids ending in 0,5 (untested check digits)
const UA = "Mozilla/5.0";
async function title(id, expect) {
  const c = code(id);
  const r = await fetch(`https://trainschedule.lk/station/${c}/x-railway-station-timetable`, { headers: { "user-agent": UA } });
  const h = await r.text();
  const t = ((h.match(/<h1>([^<]+)<\/h1>/) || [])[1] || "").trim();
  const rows = (h.match(/<tr>/g) || []).length - 1;
  return { id, expect, code: c, title: t, rows, match: t.toLowerCase().startsWith(expect.toLowerCase()) };
}
const checks = [];
checks.push(await title(209, "Matara"));      // ends 9
checks.push(await title(360, "Veyangoda"));   // ends 0 -> check digit 'a'
checks.push(await title(305, "Ratmalana"));   // ends 5 -> check digit 'k'
checks.push(await title(5, "Akurala"));       // ends 5, low id
checks.push(await title(127, "Jaffna"));      // ends 7
checks.push(await title(347, "Trincomalee")); // ends 7
console.log(JSON.stringify({ knownScore: `${ok}/15`, checks }, null, 1));
