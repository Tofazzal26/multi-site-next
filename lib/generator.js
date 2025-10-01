import fs from "fs-extra";
import path from "path";
import { execSync } from "child_process";
import { connect } from "./db.js";
import Site from "../models/Site.js";

const ROOT = process.cwd();
const TEMPLATE = path.join(ROOT, "template");
const BUILD_DIR = path.join(ROOT, "build");

export async function generateAll() {
  await connect();
  const rows = await Site.find({}).lean();
  if (!rows.length) throw new Error("Database Not Found");

  await fs.ensureDir(BUILD_DIR);

  for (const site of rows) {
    const domain = (site.domain || "").trim();
    if (!domain) continue;
    console.log(`\n=== Building: ${domain} ===`);
    const temp = path.join(ROOT, `temp_${domain}`);

    fs.removeSync(temp);
    fs.copySync(TEMPLATE, temp);

    // Hero.jsx
    const heroPath = path.join(temp, "components", "Hero.jsx");
    if (fs.existsSync(heroPath)) {
      let content = fs.readFileSync(heroPath, "utf8");
      content = content.replace(/\[\[\s*([\s\S]*?)\s*\]\]/g, (_, inner) => {
        return inner.split("|")[0].trim();
      });
      fs.writeFileSync(heroPath, content, "utf8");
    }

    // Contact.jsx
    const contactPath = path.join(temp, "components", "Contact.jsx");
    if (fs.existsSync(contactPath)) {
      let content = fs.readFileSync(contactPath, "utf8");
      const phone = site.phone || "";
      const address = (site.address || "").replace(/\r?\n/g, ", ");
      content = content
        .replace(/\{\{\s*phone\s*\}\}/g, phone)
        .replace(/\{\{\s*address\s*\}\}/g, address);
      fs.writeFileSync(contactPath, content, "utf8");
    }

    // build
    try {
      console.log("Running build in temp (npm run build)...");
      execSync("npm run build", { cwd: temp, stdio: "inherit" });
    } catch (err) {
      console.error("Build failed for", domain, err.message);
      fs.removeSync(temp);
      continue;
    }

    const outDir = path.join(temp, "out");
    const dest = path.join(BUILD_DIR, domain);
    fs.removeSync(dest);
    fs.copySync(outDir, dest);

    fs.removeSync(temp);
    console.log(`✅ Built ${domain} -> ${dest}`);
  }
}
