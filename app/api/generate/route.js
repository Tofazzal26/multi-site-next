// app/api/generate/route.js
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const { generateAll } = require("../../../lib/generator");
    await generateAll();
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500 }
    );
  }
}
