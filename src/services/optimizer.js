const { getCatalogBuckets } = require("./amazon");

function buildDailyOptimizationMap(metrics, dateKey) {
  const buckets = getCatalogBuckets();
  const clicks = metrics?.clicksByProductId || {};
  const impressions = metrics?.impressionsByProductId || {};
  const map = {};

  for (const bucket of buckets) {
    let best = bucket.candidates[0];
    let bestScore = -1;
    for (const candidate of bucket.candidates) {
      const c = clicks[candidate.id] || 0;
      const i = impressions[candidate.id] || 0;
      // Bayesian-smoothed CTR score + volume bonus
      const ctr = (c + 1) / (i + 8);
      const score = ctr * 100 + c * 0.15;
      if (score > bestScore) {
        best = candidate;
        bestScore = score;
      }
    }
    map[bucket.key] = best.id;
  }

  return {
    dateKey,
    map,
  };
}

module.exports = {
  buildDailyOptimizationMap,
};
