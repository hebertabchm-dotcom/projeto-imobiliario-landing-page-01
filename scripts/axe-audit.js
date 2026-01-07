const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");
const axeCore = require("axe-core");

(async function runAudit() {
  try {
    const file = path.resolve(__dirname, "..", "index.html");
    const html = fs.readFileSync(file, "utf8");

    const dom = new JSDOM(html, { url: "http://localhost" });
    const { window } = dom;

    // DEBUG: list available keys on axeCore
    console.log("axeCore keys:", Object.keys(axeCore));

    // Inject or use axe depending on the package shape
    let results;
    if (axeCore && typeof axeCore.source === "string") {
      // inject axe source by creating a script element in the JSDOM document
      const scriptEl = window.document.createElement("script");
      scriptEl.textContent = axeCore.source;
      window.document.head.appendChild(scriptEl);
      console.log("window.axe after injection:", typeof window.axe);
      if (!window.axe)
        throw new Error("window.axe not available after injection");
      results = await window.axe.run(window.document, {
        runOnly: { type: "tag", values: ["wcag2a", "wcag2aa"] },
      });
    } else if (axeCore && typeof axeCore.run === "function") {
      // some exports expose run directly
      console.log("using axeCore.run directly");
      results = await axeCore.run(window.document, {
        runOnly: { type: "tag", values: ["wcag2a", "wcag2aa"] },
      });
    } else {
      throw new Error("Could not initialize axe-core in this environment");
    }

    const outPath = path.resolve(__dirname, "..", "reports", "axe-report.json");
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, JSON.stringify(results, null, 2));

    console.log("Axe audit complete — report saved to", outPath);
    console.log("Violations:", results.violations.length);
  } catch (err) {
    console.error("Audit failed:", err);
    process.exitCode = 2;
  }
})();
