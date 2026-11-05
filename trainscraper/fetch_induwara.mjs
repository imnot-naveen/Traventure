// Fetch induwara.lk timetable page and inspect for embedded data / API endpoints.
import fs from "node:fs";
const url = "https://induwara.lk/tools/sri-lanka-train-timetable";
const res = await fetch(url, { headers: { "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36", "accept": "text/html" } });
const html = await res.text();
fs.writeFileSync("state/induwara_page.html", html);
console.log("status", res.status, "len", html.length);

// look for script srcs, self.__next_f.push chunks, api hints
const srcs = [...html.matchAll(/<script[^>]*src="([^"]+)"/g)].map(m => m[1]);
console.log("scripts:", srcs);

// search for interesting keywords
for (const kw of ["Kandy", "Badulla", " timetable", "api/", "self.__next_f.push", "trainNo", "departure", "Colombo"]) {
  const idx = html.indexOf(kw);
  console.log(`kw "${kw}": ${idx}`);
}

// count next_f chunks
const chunks = [...html.matchAll(/self\.__next_f\.push\((.*?)\)<\/script>/gs)];
console.log("next_f chunks:", chunks.length);

// find fetch/XHR URLs referenced
const urls = [...html.matchAll(/"(\/api\/[^"]+|https:\/\/induwara\.lk\/api\/[^"]+)"/g)].map(m => m[1]);
console.log("api urls:", [...new Set(urls)].slice(0, 50));
