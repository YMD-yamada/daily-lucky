const test = require("node:test");
const assert = require("node:assert/strict");
const { createFallbackData, SIGNS } = require("./horoscope");

test("createFallbackData returns 12 signs", () => {
  const rows = createFallbackData("2026/04/22");
  assert.equal(rows.length, 12);
  assert.deepEqual(
    [...new Set(rows.map((v) => v.sign))].sort(),
    [...SIGNS].sort()
  );
});

test("createFallbackData marks source as fallback", () => {
  const rows = createFallbackData("2026/04/22");
  assert.equal(rows[0].source, "fallback");
});
