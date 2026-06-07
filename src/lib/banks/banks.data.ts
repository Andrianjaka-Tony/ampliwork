import fs from "node:fs";
import path from "node:path";

import { z } from "zod";

import {
  amexFileSchema,
  boaFileSchema,
  chaseFileSchema,
  type AmexFile,
  type Bank,
  type BoaFile,
  type ChaseFile,
} from "./banks.schema";

const FILE_BY_BANK: Record<Bank, string> = {
  chase: "chase.json",
  boa: "boa.json",
  amex: "amex.json",
};

function bankFilePath(file: string): string {
  return path.join(process.cwd(), "data", "transactions", file);
}

function readAndValidate<T>(file: string, schema: z.ZodType<T>): T {
  const raw = fs.readFileSync(bankFilePath(file), "utf-8");
  return schema.parse(JSON.parse(raw) as unknown);
}

export function readRawBankFile(bank: Bank): string {
  return fs.readFileSync(bankFilePath(FILE_BY_BANK[bank]), "utf-8");
}

let chaseCache: ChaseFile | null = null;
let boaCache: BoaFile | null = null;
let amexCache: AmexFile | null = null;

export function getChaseFile(): ChaseFile {
  return (chaseCache ??= readAndValidate("chase.json", chaseFileSchema));
}

export function getBoaFile(): BoaFile {
  return (boaCache ??= readAndValidate("boa.json", boaFileSchema));
}

export function getAmexFile(): AmexFile {
  return (amexCache ??= readAndValidate("amex.json", amexFileSchema));
}

export function getAllBankFiles() {
  return {
    chase: getChaseFile(),
    boa: getBoaFile(),
    amex: getAmexFile(),
  };
}
