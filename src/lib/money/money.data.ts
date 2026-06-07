import fs from "node:fs";
import path from "node:path";

import { ratesFileSchema, type RatesFile } from "./money.schema";

let cache: RatesFile | null = null;

export function getRatesFile(): RatesFile {
  if (cache) return cache;

  const filePath = path.join(process.cwd(), "data", "rates.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  cache = ratesFileSchema.parse(JSON.parse(raw) as unknown);
  return cache;
}
