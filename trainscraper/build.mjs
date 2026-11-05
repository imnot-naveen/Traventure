// build.mjs v2 - assemble trains from stops pages + station pages, map to Traventure IDs, emit exports.
import fs from "node:fs";
import path from "node:path";

const DIR = path.dirname(new URL(import.meta.url).pathname.replace(/^\//, "").replace(/^([A-Za-z]:)/, "$1"));
const STATE = path.join(DIR, "state");
const OUT = path.join(DIR, "out");
fs.mkdirSync(OUT, { recursive: true });
const load = (f, d) => { try { return JSON.parse(fs.readFileSync(path.join(STATE, f), "utf8")); } catch { return d; } };
const write = (f, v) => fs.writeFileSync(path.join(OUT, f), typeof v === "string" ? v : JSON.stringify(v, null, 1));

const master = load("stationmaster.json", []);
const pages = load("stationpages.json", {});
const schedules = load("schedules.json", {});
const types = load("traintypes.json", {});
const stopsData = load("stops.json", {});
const theirs = load("theirstations.json", { stations: [], routes: [] });

const warnings = [];
const norm = s => (s || "").toLowerCase().replace(/\s+/g, " ").trim();
const nameOf = id => (master.find(m => m.id === id) || {}).name;

// ---------- station code decode ----------
const decStationCode = code => {
  const a = code.split("").map(c => (c >= "a" && c <= "z") ? c.charCodeAt(0) - 97 : c.charCodeAt(0) - 48 + 26);
  return a[0] + 36 * a[1] + 1296 * a[2] - 123;
};
const slugName = url => {
  const m = (url || "").match(/\/station\/[a-z0-9]+\/([a-z0-9-]+)-railway-station/);
  if (!m) return null;
  return m[1].split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
};

// ---------- time helpers ----------
const to24 = s => {
  if (s == null) return null;
  s = String(s).trim();
  if (!s) return null;
  if (/^\d{1,2}:\d{2}:\d{2}$/.test(s)) return s.length === 7 ? "0" + s : s;
  const m = s.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return null;
  let h = +m[1] % 12;
  if (m[3].toUpperCase() === "PM") h += 12;
  return String(h).padStart(2, "0") + ":" + m[2] + ":00";
};
const toMin = t => { if (!t) return null; const [h, m] = t.split(":").map(Number); return h * 60 + m; };

// ---------- 1. collect trains from stops pages ----------
const byTrain = {}; // trainNo -> [{code, stops}]
for (const [code, v] of Object.entries(stopsData)) {
  if (!v.stops || !v.stops.length) continue;
  const tn = v.stops.map(e => e.trainModel && e.trainModel.trainNo).find(Boolean);
  if (!tn) continue;
  (byTrain[tn] ||= []).push({ code, stops: v.stops });
}
const isSubseq = (sub, sup) => { let j = 0; for (const x of sub) { while (j < sup.length && sup[j] !== x) j++; if (j >= sup.length) return false; j++; } return true; };

const trains = [];
let subseqFail = 0, multiPageTrains = 0;
for (const [tn, list] of Object.entries(byTrain)) {
  list.sort((a, b) => b.stops.length - a.stops.length);
  const best = list[0];
  if (list.length > 1) {
    multiPageTrains++;
    for (const other of list.slice(1)) {
      const seq = other.stops.map(e => decStationCode((e.stationProfileURL || "").match(/\/station\/([a-z0-9]+)\//)?.[1] || ""));
      const bseq = best.stops.map(e => decStationCode((e.stationProfileURL || "").match(/\/station\/([a-z0-9]+)\//)?.[1] || ""));
      if (!isSubseq(seq, bseq)) { subseqFail++; break; }
    }
  }
  const stops = [];
  for (const e of best.stops) {
    const m = (e.stationProfileURL || "").match(/\/station\/([a-z0-9]+)\//);
    if (!m) continue;
    stops.push({
      srcStationId: decStationCode(m[1]),
      stationUrl: e.stationProfileURL,
      arrival: to24(e.fromArrivalTime),
      departure: to24(e.fromDepartureTime),
    });
  }
  trains.push({ trainNo: tn, source: "stops-page", code: best.code, pages: list.length, stops });
}
if (subseqFail) warnings.push(`${subseqFail} train(s) have stops pages whose station sequence is not a subsequence of the longest page (longest page used).`);
if (multiPageTrains) warnings.push(`${multiPageTrains} train(s) had multiple stops pages; the longest page (full route) was used.`);

// ---------- 2. trains only known from station pages ----------
const stopTrainNos = new Set(trains.map(t => t.trainNo));
const pageRowsByTrain = {};
for (const p of Object.values(pages)) for (const r of p.rows) (pageRowsByTrain[r.trainNo] ||= []).push({ stationId: p.id, stationName: p.masterName, ...r });

for (const [tn, allRows] of Object.entries(pageRowsByTrain)) {
  if (stopTrainNos.has(tn)) continue;
  const cnt = arr => { const m = {}; for (const x of arr) m[x] = (m[x] || 0) + 1; return Object.entries(m).sort((a, b) => b[1] - a[1])[0][0]; };
  // some trains are listed under two route variants (different destinations on different days);
  // keep only the majority variant so stops are not duplicated (e.g. 1527A)
  const vcount = {};
  for (const r of allRows) { const k = norm(r.from) + ">" + norm(r.to); vcount[k] = (vcount[k] || 0) + 1; }
  const vkeys = Object.keys(vcount).sort((a, b) => vcount[b] - vcount[a]);
  const rows = allRows.filter(r => norm(r.from) + ">" + norm(r.to) === vkeys[0]);
  if (vkeys.length > 1) warnings.push(`Train ${tn}: listed under ${vkeys.length} route variants (${vkeys.map(k => `${k} x${vcount[k]}`).join(", ")}); stops taken from the majority variant (${vcount[vkeys[0]]} of ${allRows.length} rows).`);
  const origin = cnt(rows.map(r => norm(r.from)));
  const dest = cnt(rows.map(r => norm(r.to)));
  // anchor = departure at the origin station itself (the row on the origin station's own page),
  // not just any row whose "from" field matches - otherwise midnight journeys rotate wrongly (e.g. 7083A)
  let anchorRow = rows.find(r => r.stationName && norm(r.stationName) === origin && to24(r.departure));
  if (!anchorRow) {
    anchorRow = rows.find(r => norm(r.from) === origin && to24(r.departure));
    warnings.push(`Train ${tn}: row at origin station "${origin}" not found on its station page; anchor taken from another row (stop order may be unreliable).`);
  }
  const anchor = anchorRow ? toMin(to24(anchorRow.departure)) : null;
  const stops = rows.map(r => ({
    stationId: r.stationId,
    stationUrl: null,
    arrival: to24(r.arrival),
    departure: to24(r.departure),
    _rawFrom: origin, _rawTo: dest, _anchor: anchor,
  }));
  trains.push({ trainNo: tn, source: "station-pages", code: null, pages: 1, stops, _origin: origin, _dest: dest, _anchor: anchor });
}

// order station-page-only trains by elapsed time since origin departure
for (const t of trains.filter(x => x.source === "station-pages")) {
  const anchor = t._anchor;
  if (anchor == null) { warnings.push(`Train ${t.trainNo}: origin station row not found; stop order may be unreliable.`); continue; }
  const key = st => {
    const m = toMin(st.departure || st.arrival);
    if (m == null) return 0;
    let raw = m - anchor;
    if (raw < -720) raw += 1440;
    return raw;
  };
  // origin's own arrival may precede its departure -> keep it first
  t.stops.sort((a, b) => {
    const ka = key(a), kb = key(b);
    if (ka !== kb) return ka - kb;
    return 0;
  });
}

// fill missing arrival/departure (API requires both non-empty)
let filledTimes = 0;
for (const t of trains) {
  for (const s of t.stops) {
    if (!s.arrival && s.departure) { s.arrival = s.departure; filledTimes++; }
    else if (!s.departure && s.arrival) { s.departure = s.arrival; filledTimes++; }
    else if (!s.arrival && !s.departure) { warnings.push(`Train ${t.trainNo} stop at src station ${s.srcStationId ?? s.stationId} has no times.`); }
  }
}
if (filledTimes) warnings.push(`${filledTimes} stop time(s) were missing arrival or departure and were copied from the other value.`);

// ---------- 3. days + type ----------
const dayTokens = str => String(str || "").split(/[|,]/).map(s => s.trim()).filter(Boolean);
const daysByTrain = {};
for (const [tn, rows] of Object.entries(pageRowsByTrain)) {
  const seen = [];
  for (const r of rows) for (const tok of dayTokens(r.days)) if (!seen.includes(tok)) seen.push(tok);
  const variants = [...new Set(rows.map(r => String(r.days || "").trim()))];
  daysByTrain[tn] = { days: seen.join(", "), variants };
}
let dayConflicts = 0;
for (const [tn, v] of Object.entries(daysByTrain)) if (v.variants.length > 1) { dayConflicts++; }
if (dayConflicts) warnings.push(`${dayConflicts} train(s) had multiple different day strings across station pages; the union of days was used.`);

const untyped = [];
for (const t of trains) {
  t.days = daysByTrain[t.trainNo] ? daysByTrain[t.trainNo].days : "";
  t.type = types[t.trainNo] || null;
  if (!t.type) untyped.push(t.trainNo);
  if (!t.days) warnings.push(`Train ${t.trainNo}: no running days found on station pages.`);
}
if (untyped.length) warnings.push(`${untyped.length} train(s) have no train type on the source site (type set to "Unknown"): ${untyped.join(", ")}`);

// stop ordering sanity (for stops-page trains)
let orderViol = 0;
for (const t of trains) {
  if (t.source !== "stops-page") continue;
  for (let i = 1; i < t.stops.length; i++) {
    const a = toMin(t.stops[i - 1].departure || t.stops[i - 1].arrival);
    const b = toMin(t.stops[i].arrival || t.stops[i].departure);
    if (a == null || b == null) continue;
    if (b < a - 720 || b > a + 720) { orderViol++; break; }
  }
}
if (orderViol) warnings.push(`${orderViol} train(s) have stop times that jump more than 12h; check midnight wrapping.`);

// ---------- 4. stations: add any station not in master ----------
const extraStations = [];
for (const t of trains) for (const s of t.stops) {
  const id = s.srcStationId ?? s.stationId;
  if (!master.find(m => m.id === id)) {
    const nm = slugName(s.stationUrl) || ("Station " + id);
    master.push({ id, name: nm });
    extraStations.push({ id, name: nm });
  }
}
if (extraStations.length) warnings.push(`${extraStations.length} station(s) appeared in train routes but not in the station list and were added: ${extraStations.map(s => `${s.id}:${s.name}`).join(", ")}`);

// ---------- 5. map source stations -> Traventure station IDs ----------
const lev = (a, b) => {
  const m = a.length, n = b.length;
  if (!m || !n) return Math.max(m, n);
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[n];
};
const fuzzyKey = s => norm(s).replace(/[^a-z0-9]/g, "");
// pairs verified as DIFFERENT real-world stations (coords + route order checked); left unmatched instead
const fuzzyDeny = new Set(["ragama>rajgama", "kinigama>sinigama", "mirigama>sinigama"]);

const theirById = new Map(theirs.stations.map(s => [s.stationID, s]));
const theirByNorm = new Map();
for (const s of theirs.stations) { const k = norm(s.name); if (!theirByNorm.has(k)) theirByNorm.set(k, []); theirByNorm.get(k).push(s.stationID); }

const srcToTsl = new Map();   // source station id -> traventure station id
const matchedSrc = new Set();
const matchLog = [];
let nextNewId = Math.max(...theirs.stations.map(s => s.stationID)) + 1; // 189

// exact normalized match first
for (const m of master) {
  const k = norm(m.name);
  const hit = theirByNorm.get(k);
  if (hit && hit.length === 1) { srcToTsl.set(m.id, hit[0]); matchedSrc.add(m.id); matchLog.push({ src: m.id, srcName: m.name, tsl: hit[0], tslName: theirById.get(hit[0]).name, method: "exact" }); }
}
// fuzzy for the rest
const fuzzyCandidates = theirs.stations.filter(s => !matchLog.some(l => l.tsl === s.stationID));
for (const m of master) {
  if (matchedSrc.has(m.id)) continue;
  const a = fuzzyKey(m.name);
  let best = null;
  for (const s of fuzzyCandidates) {
    const b = fuzzyKey(s.name);
    if (fuzzyDeny.has(a + ">" + b)) continue;
    const d = lev(a, b);
    const tol = Math.max(1, Math.floor(Math.max(a.length, b.length) * 0.25));
    if (d <= tol && (!best || d < best.d)) best = { d, s };
  }
  if (best) {
    srcToTsl.set(m.id, best.s.stationID); matchedSrc.add(m.id);
    matchLog.push({ src: m.id, srcName: m.name, tsl: best.s.stationID, tslName: best.s.name, method: `fuzzy(d=${best.d})` });
    fuzzyCandidates.splice(fuzzyCandidates.indexOf(best.s), 1);
  }
}
// new ids for unmatched source stations
const newStations = [];
for (const m of master) {
  if (matchedSrc.has(m.id)) continue;
  srcToTsl.set(m.id, nextNewId);
  newStations.push({ tslId: nextNewId, srcId: m.id, name: m.name });
  nextNewId++;
}
const unmatchedTheirs = theirs.stations.filter(s => !matchLog.some(l => l.tsl === s.stationID));

// ---------- 5.5 gap trains from induwara.lk (only trains trainschedule.lk has NO data for) ----------
const iwTrainsRaw = load("induwara_trains.json", []);
const iwStations = load("induwara_stations.json", []);
const iwMerge = { added: [], skipped: [], stationMap: {}, unmapped: [] };
{
  const strip = s => norm(s).replace(/\s*\([^)]*\)/g, "").replace(/\s+junction$/, "").trim();
  const compact = s => strip(s).replace(/[^a-z0-9]/g, "");
  const byNorm = new Map(), byStrip = new Map(), byCompact = new Map();
  for (const m of master) {
    if (!byNorm.has(norm(m.name))) byNorm.set(norm(m.name), m);
    if (!byStrip.has(strip(m.name))) byStrip.set(strip(m.name), m);
    if (!byCompact.has(compact(m.name))) byCompact.set(compact(m.name), m);
  }
  const iwToSrc = new Map();
  const mapIw = slug => {
    if (iwToSrc.has(slug)) return iwToSrc.get(slug);
    const iwS = iwStations.find(s => s.id === slug);
    if (!iwS) { iwMerge.unmapped.push(`${slug}: not in induwara station map`); return null; }
    let m = byNorm.get(norm(iwS.name));
    let method = "exact";
    if (!m) { m = byStrip.get(strip(iwS.name)); method = "normalized"; }
    if (!m) { m = byCompact.get(compact(iwS.name)); method = "compact"; }
    if (!m) {
      // fuzzy fallback (logged for review)
      const a = compact(iwS.name);
      let best = null;
      for (const c of master) {
        const b = compact(c.name);
        const d = lev(a, b);
        const tol = Math.max(1, Math.floor(Math.max(a.length, b.length) * 0.25));
        if (d <= tol && (!best || d < best.d)) best = { d, c };
      }
      if (best) { m = best.c; method = `fuzzy(d=${best.d})`; }
    }
    if (!m) { iwMerge.unmapped.push(`${slug} "${iwS.name}"`); return null; }
    if (norm(m.name) !== norm(iwS.name)) iwMerge.stationMap[`${slug} "${iwS.name}"`] = `${m.id} "${m.name}" [${method}]`;
    iwToSrc.set(slug, m.id);
    return m.id;
  };

  const have = new Set(trains.map(t => String(t.trainNo)));
  const dayMap = { daily: "Mon, Tue, Wed, Thu, Fri, Sat, Sun", weekdays: "Mon, Tue, Wed, Thu, Fri" };
  const typeMap = { intercity: "Intercity Express", express: "Express", night_mail: "Express", slow: "Slow" };
  const toHHMMSS = t => { if (!t) return null; const [h, m] = t.split(":"); return String(h).padStart(2, "0") + ":" + m + ":00"; };
  for (const it of iwTrainsRaw) {
    if (have.has(String(it.number))) { iwMerge.skipped.push(String(it.number)); continue; }
    const stops = [];
    let ok = true;
    for (const st of it.stops) {
      const id = mapIw(st.station);
      if (id == null) { ok = false; break; }
      stops.push({ srcStationId: id, stationUrl: null, arrival: toHHMMSS(st.arr), departure: toHHMMSS(st.dep) });
    }
    if (!ok) continue;
    for (const s of stops) {
      if (!s.arrival && s.departure) s.arrival = s.departure;
      else if (!s.departure && s.arrival) s.departure = s.arrival;
      else if (!s.arrival && !s.departure) warnings.push(`induwara train ${it.number}: stop at src station ${s.srcStationId} has no times.`);
    }
    trains.push({
      trainNo: String(it.number), source: "induwara.lk", code: null, pages: 1,
      days: dayMap[it.days] || "Mon, Tue, Wed, Thu, Fri, Sat, Sun",
      type: typeMap[it.category] || "Unknown",
      stops,
    });
    iwMerge.added.push(String(it.number));
  }
  if (iwMerge.unmapped.length) { console.error("UNMAPPED induwara stations:", iwMerge.unmapped); process.exit(1); }
}
if (iwMerge.added.length) warnings.push(`${iwMerge.added.length} gap train(s) added from induwara.lk: ${iwMerge.added.join(", ")}`);

// ---------- 6. trainID encoding ----------
const suffixCode = new Map([["", 0]]);
for (const t of trains) {
  const m = String(t.trainNo).match(/^(\d+)(.*)$/);
  const suf = (m ? m[2] : "").trim();
  if (!suffixCode.has(suf)) suffixCode.set(suf, suffixCode.size);
}
const encodeTrainId = tn => {
  const m = String(tn).match(/^(\d+)(.*)$/);
  if (!m) return null;
  return Number(m[1]) * 1000 + suffixCode.get(m[2].trim());
};
const dupIds = {};
for (const t of trains) { const id = encodeTrainId(t.trainNo); t.trainID = id; dupIds[id] = (dupIds[id] || 0) + 1; }
const collisions = Object.entries(dupIds).filter(([, c]) => c > 1);
if (collisions.length) warnings.push(`trainID collisions: ${JSON.stringify(collisions)}`);
const existingTrainIds = [1,2,3,4,5,6,7,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,36,37,38,39,41,42,43,44,45,46,47,48,49,50,101];
const clash = trains.filter(t => existingTrainIds.includes(t.trainID));
if (clash.length) warnings.push(`trainID clash with existing dummy trains: ${clash.map(t => t.trainNo).join(", ")}`);

// ---------- 7. assemble outputs ----------
const tslIdOf = srcId => srcToTsl.get(srcId);
const pad2 = n => String(n).padStart(2, "0");

const trainsFull = [];
const trainsApi = [];
const stopRows = [];
const routeMap = new Map();

const longName = [];
for (const t of trains) {
  const stops = t.stops.map(s => {
    const srcId = s.srcStationId ?? s.stationId;
    const tslId = tslIdOf(srcId);
    return { stationID: tslId, srcStationID: srcId, stationName: nameOf(srcId) || "??", arrivalTime: s.arrival, departureTime: s.departure };
  });
  const start = stops[0], end = stops[stops.length - 1];
  let name = String(t.trainNo);
  if (name.length > 20) { name = name.slice(0, 20); longName.push(t.trainNo); }
  let type = t.type || "Unknown";
  if (type.length > 20) { warnings.push(`Train ${t.trainNo}: type "${type}" exceeds varchar(20); truncated.`); type = type.slice(0, 20); }
  const days = t.days || "Daily";
  if (days.length > 255) warnings.push(`Train ${t.trainNo}: days string exceeds varchar(255).`);

  trainsFull.push({
    trainID: t.trainID, trainNo: t.trainNo, name, type, days,
    startStation: start.stationID, endStation: end.stationID,
    startStationName: start.stationName, endStationName: end.stationName,
    departureTime: start.departureTime, arrivalTime: end.arrivalTime,
    stopCount: stops.length, source: t.source, sourceCode: t.code,
    stops,
  });
  trainsApi.push({
    trainID: t.trainID, name, type,
    startStation: start.stationID, endStation: end.stationID,
    departureTime: start.departureTime, arrivalTime: end.arrivalTime,
    date: days, stops: stops.map(s => ({ stationID: s.stationID, arrivalTime: s.arrivalTime, departureTime: s.departureTime })),
  });
  stops.forEach((s, i) => stopRows.push({ trainID: t.trainID, trainNo: t.trainNo, stopNo: i + 1, stationID: s.stationID, stationName: s.stationName, arrivalTime: s.arrivalTime, departureTime: s.departureTime }));

  const rk = `${start.stationID}-${end.stationID}`;
  const prev = routeMap.get(rk);
  if (!prev || stops.length > prev.stops.length) routeMap.set(rk, { routeName: `${start.stationName} - ${end.stationName}`, startStation: start.stationID, endStation: end.stationID, orderedStations: stops.map(s => s.stationID).join(","), stops: stops.length, trains: (prev ? prev.trains : 0) + 1 });
  else prev.trains++;
}
if (longName.length) warnings.push(`${longName.length} train number(s) exceed varchar(20) and were truncated: ${longName.join(", ")}`);

const routes = [...routeMap.values()].map(({ stops, ...r }) => r);

// stations file
const stationsOut = master.map(m => {
  const tsl = srcToTsl.get(m.id);
  const matched = matchLog.find(l => l.src === m.id);
  const hasSchedule = trains.some(t => t.stops.some(s => (s.srcStationId ?? s.stationId) === m.id));
  return { stationID: tsl, srcStationID: m.id, name: m.name, city: m.name, matchedTo: matched ? matched.tslName : null, matchMethod: matched ? matched.method : "new", hasScheduleData: hasSchedule };
}).sort((a, b) => a.stationID - b.stationID);

// name length checks for stations we would insert
const stationTrunc = newStations.filter(s => s.name.length > 20);
if (stationTrunc.length) warnings.push(`${stationTrunc.length} new station name(s) exceed varchar(20) and must be truncated on insert: ${stationTrunc.map(s => s.name).join(", ")}`);

// ---------- 8. write outputs ----------
const csvEsc = v => { v = v == null ? "" : String(v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };

write("stations.json", stationsOut);
write("stations.csv", ["stationID,srcStationID,name,city,matchedTo,matchMethod,hasScheduleData",
  ...stationsOut.map(s => [s.stationID, s.srcStationID, s.name, s.city, s.matchedTo || "", s.matchMethod, s.hasScheduleData].map(csvEsc).join(","))].join("\n"));
write("trains-addmultiple.json", trainsApi);
write("trains-full.json", trainsFull);
write("trainstops.csv", ["trainID,trainNo,stopNo,stationID,stationName,arrivalTime,departureTime",
  ...stopRows.map(r => [r.trainID, r.trainNo, r.stopNo, r.stationID, r.stationName, r.arrivalTime, r.departureTime].map(csvEsc).join(","))].join("\n"));
write("routes.json", routes);
write("stations-matchlog.json", { matchLog, newStations, unmatchedTheirs: unmatchedTheirs.map(s => ({ stationID: s.stationID, name: s.name, city: s.city })) });

// SQL inserts
const q = v => v == null ? "NULL" : "'" + String(v).replace(/'/g, "''") + "'";
const chunk = (arr, n) => { const out = []; for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n)); return out; };
let sql = `-- Generated from trainschedule.lk data on ${new Date().toISOString()}\n-- Adds ${newStations.length} new stations, ${trainsApi.length} trains, ${stopRows.length} train stops, ${routes.length} routes.\n-- Does not modify existing rows.\n\n`;
for (const c of chunk(newStations, 200)) sql += `INSERT INTO station (stationID, city, name) VALUES\n${c.map(s => `(${s.tslId}, ${q(s.name.length > 20 ? s.name.slice(0, 20) : s.name)}, ${q(s.name.length > 20 ? s.name.slice(0, 20) : s.name)})`).join(",\n")};\n\n`;
for (const c of chunk(trainsApi, 100)) sql += `INSERT INTO train (trainID, name, type, startStation, endStation, departureTime, arrivalTime, days) VALUES\n${c.map(t => `(${t.trainID}, ${q(t.name)}, ${q(t.type)}, ${t.startStation}, ${t.endStation}, ${q(t.departureTime)}, ${q(t.arrivalTime)}, ${q(t.date)})`).join(",\n")};\n\n`;
for (const c of chunk(stopRows, 500)) sql += `INSERT INTO trainstops (trainID, stationid, arrivaltime, departuretime) VALUES\n${c.map(s => `(${s.trainID}, ${s.stationID}, ${q(s.arrivalTime)}, ${q(s.departureTime)})`).join(",\n")};\n\n`;
for (const c of chunk(routes, 100)) sql += `INSERT INTO routes (routeName, startStation, endStation, orderedStations) VALUES\n${c.map(r => `(${q(r.routeName)}, ${r.startStation}, ${r.endStation}, ${q(r.orderedStations)})`).join(",\n")};\n\n`;
write("inserts.sql", sql);

// ---------- 9. report ----------
const noSchedStations = stationsOut.filter(s => !s.hasScheduleData);
const report = {
  generatedAt: new Date().toISOString(),
  source: "trainschedule.lk",
  stationCoverage: {
    sourceStations: master.length,
    matchedToExistingTraventure: matchLog.length,
    exactNameMatches: matchLog.filter(l => l.method === "exact").length,
    fuzzyNameMatches: matchLog.filter(l => l.method.startsWith("fuzzy")).length,
    newStationIdsAssigned: newStations.length,
    newIdRange: newStations.length ? [newStations[0].tslId, newStations[newStations.length - 1].tslId] : null,
    existingTraventureStationsWithoutSourceMatch: unmatchedTheirs.map(s => `${s.stationID}:${s.name}`),
    sourceStationsWithNoScheduleData: noSchedStations.map(s => `${s.stationID}(src ${s.srcStationID})`),
  },
  trainCoverage: {
    totalTrains: trains.length,
    withFullStopListFromStopsPages: trains.filter(t => t.source === "stops-page").length,
    fromStationPagesOnly: trains.filter(t => t.source === "station-pages").length,
    withTrainType: trains.filter(t => t.type).length,
    withoutTrainType: untyped,
    totalStops: stopRows.length,
    minStops: Math.min(...trains.map(t => t.stops.length)),
    maxStops: Math.max(...trains.map(t => t.stops.length)),
    avgStops: +(stopRows.length / trains.length).toFixed(1),
  },
  routeCoverage: { routePairs: routes.length },
  induwaraGapFill: {
    source: "induwara.lk",
    trainsAdded: iwMerge.added,
    trainsSkippedAlreadyPresent: iwMerge.skipped,
    stationNameAdjustments: iwMerge.stationMap,
    unmappedStations: iwMerge.unmapped,
    note: "induwara.lk used only to fill gaps (services missing from trainschedule.lk). Per induwara.lk (checked 2026-10-17), the Peradeniya Jn-Kandy and Gampola-Nanu Oya sections were suspended after Cyclone Ditwah; the times stored are the published SLR schedule.",
  },
  trainIdEncoding: { formula: "trainID = numericPart * 1000 + suffixCode", suffixCodes: Object.fromEntries(suffixCode), note: "keeps letter-suffixed train numbers unique and clear of existing IDs 1-101" },
  knownSourceGaps: [
    "The source site has no schedule data at all for 74 stations (the Kandy / Up-Country / Matale lines and a few halts): see stationCoverage.sourceStationsWithNoScheduleData.",
    "55 trains appear only on station pages (no stops page on the source); their stop order is derived from per-station times and their type is unknown.",
    "The source's own sitemap URLs for Colombo Fort->Kandy etc. return 'No train schedules found!' - this is a source-side gap, not a scraping gap.",
  ],
  warnings,
};
write("report.json", report);

console.log(JSON.stringify(report, null, 1));
console.log(`\nwrote ${fs.readdirSync(OUT).join(", ")}`);
