import fs from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36";
const ch = v => v < 26 ? String.fromCharCode(97 + v) : String.fromCharCode(48 + (v - 26));
const statCode = id => { const V = id + 123; return ch(V % 36) + ch(Math.floor(V / 36) % 36) + ch(Math.floor(V / 1296) % 36) + ch((2 * (id % 10)) % 36); };
const rowRe = /<td>.*?<\/td>/g;

const found = [];
const ids = [];
for (let i = 397; i <= 700; i++) ids.push(i);
for (let i = 1; i <= 396; i++) ids.push(i); // re-verify known set cheaply? no, skip
// only unknown range
let i = 0;
const worker = async () => {
  while (i < ids.length) {
    const id = ids[i++];
    try {
      const r = await fetch(`https://trainschedule.lk/station/${statCode(id)}/x`, { headers: { "user-agent": UA }, signal: AbortSignal.timeout(20000) });
      if (r.status !== 200) continue;
      const t = await r.text();
      const title = (t.match(/<title>([^<]*)<\/title>/) || [])[1] || "";
      const trs = (t.match(/<tr/g) || []).length;
      if (trs > 1 || (title && !title.startsWith(" -"))) found.push({ id, title, trs });
    } catch { }
    await sleep(80);
  }
};
await Promise.all(Array.from({ length: 6 }, worker));
console.log("swept 397-700; hits:", JSON.stringify(found, null, 1));
