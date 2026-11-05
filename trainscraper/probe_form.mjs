import fs from "node:fs";
const h = fs.readFileSync("probe_home.html", "utf8");
const opts = [...h.matchAll(/<option value="(\d+)">([^<]*)<\/option>/g)].map(m => ({ id: +m[1], name: m[2] }));
console.log("form options:", opts.length);
const master = JSON.parse(fs.readFileSync("state/stationmaster.json", "utf8"));
console.log("master:", master.length);
const mById = new Map(master.map(m => [m.id, m.name]));
const dup = {};
for (const o of opts) (dup[o.name.trim().toLowerCase()] ||= []).push(o.id);
console.log("duplicate names in form:", JSON.stringify(Object.entries(dup).filter(([, v]) => v.length > 1)));
console.log("in form not master:", JSON.stringify(opts.filter(o => !mById.has(o.id)).slice(0, 30)));
console.log("name mismatches:", JSON.stringify(opts.filter(o => mById.has(o.id) && mById.get(o.id).trim() !== o.name.trim()).slice(0, 40)));
console.log("max id:", Math.max(...opts.map(o => o.id)), "min:", Math.min(...opts.map(o => o.id)));
console.log("kandy-like in form:", JSON.stringify(opts.filter(o => /kandy|hatton|peradeniya|matale|nanuoya|badulla/i.test(o.name))));

// check other selects in the form (end station)
const selects = [...h.matchAll(/<select[^>]*id="([^"]*)"[\s\S]*?<\/select>/g)];
console.log("selects:", selects.map(s => s[1] + ":" + ([...s[0].matchAll(/<option/g)].length)).join(", "));
