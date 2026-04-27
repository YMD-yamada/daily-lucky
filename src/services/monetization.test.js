const test = require("node:test");
const assert = require("node:assert/strict");
const { applyAffiliateToItemUrl, appendAmazonTag } = require("./monetization");

test("applyAffiliateToItemUrl returns original when no config", () => {
  const u = "https://item.rakuten.co.jp/shop/test/";
  assert.equal(applyAffiliateToItemUrl(u), u);
});

test("applyAffiliateToItemUrl appends query for rakuten item", () => {
  process.env.RAKUTEN_AFF_QUERY = "scid=af_test";
  process.env.RAKUTEN_AFF_WRAPPER_BASE = "";
  const u = "https://item.rakuten.co.jp/shop/test/";
  assert.equal(applyAffiliateToItemUrl(u), "https://item.rakuten.co.jp/shop/test/?scid=af_test");
  delete process.env.RAKUTEN_AFF_QUERY;
});

test("appendAmazonTag appends tag when set", () => {
  process.env.AMAZON_ASSOCIATE_TAG = "mystore-22";
  const u = "https://www.amazon.co.jp/s?k=pen";
  const out = appendAmazonTag(u);
  assert.match(out, /[?&]tag=mystore-22$/);
  delete process.env.AMAZON_ASSOCIATE_TAG;
});
