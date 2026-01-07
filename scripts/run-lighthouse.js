const lighthouse = require("lighthouse");
const chromeLauncher = require("chrome-launcher");
const fs = require("fs");
const path = require("path");

(async () => {
  try {
    const chromePath = require("puppeteer").executablePath();
    console.log("Using chrome at", chromePath);

    const chrome = await chromeLauncher.launch({
      chromePath,
      chromeFlags: ["--headless", "--no-sandbox"],
    });

    const options = {
      logLevel: "info",
      output: "json",
      onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
      port: chrome.port,
    };

    const url = "http://127.0.0.1:8080";
    const runnerResult = await lighthouse(url, options);

    const reportJson = runnerResult.report;
    const outPath = path.resolve(
      __dirname,
      "..",
      "reports",
      "lighthouse-report.json"
    );
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, reportJson);

    console.log("Lighthouse report saved to", outPath);

    await chrome.kill();
  } catch (err) {
    console.error("Lighthouse run failed:", err);
    process.exitCode = 2;
  }
})();
