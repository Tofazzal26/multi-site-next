// 🚀 Load .env.local before anything else
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(".env.local") });

// Now import other modules (dbConnect will see MONGODB_URI)
import fs from "fs";
import csv from "csv-parser";
import dbConnect from "../lib/db.js";
import Site from "../models/Site.js";

async function seed() {
  await dbConnect();

  const results = [];
  const csvPath = path.join(process.cwd(), "websites.csv");

  fs.createReadStream(csvPath)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      try {
        await Site.deleteMany({});
        await Site.insertMany(results);
        console.log("✅ CSV Data Imported Successfully!");
        process.exit(0);
      } catch (err) {
        console.error("❌ Error seeding data:", err);
        process.exit(1);
      }
    });
}

seed();
