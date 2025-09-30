// lib/generator.js
const fs = require("fs-extra");
const path = require("path");
const { execSync } = require("child_process");
const { connect } = require("./db");
const Site = require("../models/Site");

const ROOT = path.resolve(".");
const TEMPLATE = path.join(ROOT, "template");
const BUILD_DIR = path.join(ROOT, "build");

async function generateAll() {
  await connect();
  const rows = await Site.find({}).lean();
  if (!rows.length) throw new Error("Database এ কোন সাইট পাওয়া যায়নি।");

  await fs.ensureDir(BUILD_DIR);

  for (const site of rows) {
    const domain = (site.domain || "").trim();
    if (!domain) continue;
    console.log(`\n=== Building: ${domain} ===`);
    const temp = path.join(ROOT, `temp_${domain}`);

    // copy template
    fs.removeSync(temp);
    fs.copySync(TEMPLATE, temp);

    // Hero: replace [[ ... ]] -> first option
    const heroPath = path.join(temp, "components", "Hero.jsx");
    if (fs.existsSync(heroPath)) {
      let content = fs.readFileSync(heroPath, "utf8");
      content = content.replace(/\[\[\s*([\s\S]*?)\s*\]\]/g, (_, inner) => {
        return inner.split("|")[0].trim();
      });
      fs.writeFileSync(heroPath, content, "utf8");
    }

    // Contact: replace {{ phone }} and {{ address }}
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

    // Speed-up: copy root node_modules to temp if exists
    const rootNode = path.join(ROOT, "node_modules");
    if (fs.existsSync(rootNode)) {
      try {
        fs.copySync(rootNode, path.join(temp, "node_modules"));
      } catch (e) {
        console.warn("node_modules copy failed:", e.message);
      }
    }

    // run build (Next build & export -> out/)
    try {
      console.log("Running build in temp (npm run build)...");
      execSync("npm run build", { cwd: temp, stdio: "inherit" });
    } catch (err) {
      console.error("Build failed for", domain, err.message);
      fs.removeSync(temp);
      continue;
    }

    // move out -> build/<domain>
    const outDir = path.join(temp, "out");
    const dest = path.join(BUILD_DIR, domain);
    fs.removeSync(dest);
    fs.copySync(outDir, dest);

    // cleanup
    fs.removeSync(temp);
    console.log(`✅ Built ${domain} -> ${dest}`);
  }
}

module.exports = { generateAll };
