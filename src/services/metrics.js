const fs = require("node:fs");
const path = require("node:path");

const DATA_DIR = path.join(process.cwd(), "data");
const METRICS_FILE = path.join(DATA_DIR, "metrics.json");

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(METRICS_FILE)) {
    fs.writeFileSync(
      METRICS_FILE,
      JSON.stringify(
        {
          clicks: {},
          clicksByProductId: {},
          clicksByKeyword: {},
          impressionsByProductId: {},
          impressionsByKeyword: {},
          dailyOptimization: {},
          updatedAt: new Date().toISOString(),
        },
        null,
        2
      ),
      "utf-8"
    );
  }
}

function readMetrics() {
  ensureFile();
  const data = JSON.parse(fs.readFileSync(METRICS_FILE, "utf-8"));
  return {
    clicks: data.clicks || {},
    clicksByProductId: data.clicksByProductId || {},
    clicksByKeyword: data.clicksByKeyword || {},
    impressionsByProductId: data.impressionsByProductId || {},
    impressionsByKeyword: data.impressionsByKeyword || {},
    dailyOptimization: data.dailyOptimization || {},
    updatedAt: data.updatedAt || new Date().toISOString(),
  };
}

function writeMetrics(metrics) {
  ensureFile();
  fs.writeFileSync(
    METRICS_FILE,
    JSON.stringify({ ...metrics, updatedAt: new Date().toISOString() }, null, 2),
    "utf-8"
  );
}

function trackClick({ productId = "", productName = "", keywordKey = "" }) {
  const metrics = readMetrics();
  if (productName) metrics.clicks[productName] = (metrics.clicks[productName] || 0) + 1;
  if (productId) metrics.clicksByProductId[productId] = (metrics.clicksByProductId[productId] || 0) + 1;
  if (keywordKey) metrics.clicksByKeyword[keywordKey] = (metrics.clicksByKeyword[keywordKey] || 0) + 1;
  writeMetrics(metrics);
  return {
    byName: productName ? metrics.clicks[productName] : 0,
    byProductId: productId ? metrics.clicksByProductId[productId] : 0,
    byKeyword: keywordKey ? metrics.clicksByKeyword[keywordKey] : 0,
  };
}

function trackImpression({ productId = "", keywordKey = "" }) {
  const metrics = readMetrics();
  if (productId) metrics.impressionsByProductId[productId] = (metrics.impressionsByProductId[productId] || 0) + 1;
  if (keywordKey) metrics.impressionsByKeyword[keywordKey] = (metrics.impressionsByKeyword[keywordKey] || 0) + 1;
  writeMetrics(metrics);
  return {
    byProductId: productId ? metrics.impressionsByProductId[productId] : 0,
    byKeyword: keywordKey ? metrics.impressionsByKeyword[keywordKey] : 0,
  };
}

function updateDailyOptimization(dateKey, map) {
  const metrics = readMetrics();
  metrics.dailyOptimization[dateKey] = map;
  writeMetrics(metrics);
}

function readDailyOptimization(dateKey) {
  const metrics = readMetrics();
  return metrics.dailyOptimization[dateKey] || {};
}

module.exports = {
  readMetrics,
  trackClick,
  trackImpression,
  updateDailyOptimization,
  readDailyOptimization,
};
