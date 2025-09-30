import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Site from "@/models/Site";

// ✅ GET: সব site ফেচ করা
export async function GET() {
  try {
    await dbConnect();
    const sites = await Site.find({});
    return NextResponse.json(sites, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch sites", details: error.message },
      { status: 500 }
    );
  }
}

// ✅ POST: নতুন site add করা
export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    const site = await Site.create(body);

    return NextResponse.json(site, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create site", details: error.message },
      { status: 500 }
    );
  }
}
