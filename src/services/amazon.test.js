const test = require("node:test");
const assert = require("node:assert/strict");
const { buildProductLink } = require("./amazon");

test("buildProductLink returns direct product page for mug", () => {
  const product = buildProductLink("マグカップ");
  assert.equal(product.provider, "楽天市場");
  assert.equal(product.keywordKey, "mug");
  assert.ok(product.productId);
  assert.match(product.productUrl, /^https:\/\/item\.rakuten\.co\.jp\//);
});

test("buildProductLink uses fallback direct product page", () => {
  const product = buildProductLink("未定義アイテム");
  assert.equal(product.provider, "楽天市場");
  assert.equal(product.keywordKey, "fallback");
  assert.match(product.productUrl, /^https:\/\/item\.rakuten\.co\.jp\//);
});
