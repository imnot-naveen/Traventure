import fs from "node:fs";

const sql = fs.readFileSync("C:/Users/Naveen/Documents/GitHub/Traventure/Server/database/traventure.sql", "utf8");

const stations = [];
const stationRe = /INSERT INTO `?station`?[^;]*?VALUES\s*([\s\S]*?);/i;
const m = sql.match(stationRe);
if (!m) {
  console.error("station insert not found");
  process.exit(1);
}
const rowRe = /\(([^()]*)\)/g;
let rm;
while ((rm = rowRe.exec(m[1])) !== null) {
  const parts = rm[1].split(",").map((s) => s.trim().replace(/^'|'$/g, ""));
  if (parts.length >= 3 && /^\d+$/.test(parts[0])) {
    stations.push({ stationID: Number(parts[0]), city: parts[1], name: parts[2] });
  }
}

const routes = [];
const routeRe = /INSERT INTO `?routes`?[^;]*?VALUES\s*([\s\S]*?);/i;
const rm2 = sql.match(routeRe);
if (rm2) {
  const rr = /\(([^()]*)\)/g;
  let x;
  while ((x = rr.exec(rm2[1])) !== null) {
    const parts = x[1].split(",").map((s) => s.trim().replace(/^'|'$/g, ""));
    if (parts.length >= 4) {
      routes.push({
        routeName: parts[0],
        startStation: Number(parts[1]),
        endStation: Number(parts[2]),
        orderedStations: parts.slice(3).join(","),
      });
    }
  }
}

fs.writeFileSync("state/theirstations.json", JSON.stringify({ stations, routes }, null, 1));
console.log("their stations:", stations.length, "routes:", routes.length);
console.log("station id range:", stations[0]?.stationID, "-", stations[stations.length - 1]?.stationID);
console.log("routes:", JSON.stringify(routes, null, 1));
