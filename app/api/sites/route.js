import { NextResponse } from "next/server";
import { connect } from "@/lib/db";
import Site from "@/models/Site";

export async function GET() {
  try {
    await connect();
    const sites = await Site.find({}).lean();
    return NextResponse.json(sites);
  } catch (err) {
    console.error("Error fetching sites:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
