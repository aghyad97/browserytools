// Extracts { href, name } for every available tool from tools-config.ts
// without executing it (the file imports lucide-react icons).
import { readFileSync, writeFileSync } from "node:fs";

const src = readFileSync("src/lib/tools-config.ts", "utf8");
const routes = [];
const re = /name:\s*"([^"]+)",\s*href:\s*"(\/tools\/[^"]+)",[\s\S]*?available:\s*(true|false)/g;
let m;
while ((m = re.exec(src))) {
  if (m[3] === "true") routes.push({ name: m[1], href: m[2] });
}
if (routes.length < 100) {
  console.error(`Only ${routes.length} routes extracted — regex drifted from tools-config format`);
  process.exit(1);
}
writeFileSync("e2e/tool-routes.json", JSON.stringify(routes, null, 2) + "\n");
console.log(`wrote ${routes.length} routes`);
