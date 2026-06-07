import { NextResponse } from "next/server";

import { fail } from "@/lib/api/api.response";
import { readRawBankFile } from "@/lib/banks/banks.data";

export async function GET() {
  try {
    return new NextResponse(readRawBankFile("chase"), {
      headers: { "content-type": "application/json; charset=utf-8" },
    });
  } catch {
    return fail("INTERNAL_ERROR", "Failed to load Chase transactions.");
  }
}
