import { NextResponse } from "next/server";
import { generateAll } from "@/lib/generator";

export async function POST() {
  try {
    await generateAll();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Generate error:", err);
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500 }
    );
  }
}
