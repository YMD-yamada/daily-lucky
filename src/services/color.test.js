const test = require("node:test");
const assert = require("node:assert/strict");
const { resolveColor } = require("./color");

test("resolveColor normalizes english color", () => {
  const c = resolveColor("blue");
  assert.equal(c.colorName, "青");
  assert.equal(c.colorHex, "#3b82f6");
});

test("resolveColor falls back safely", () => {
  const c = resolveColor("unknown-color");
  assert.equal(c.colorName, "白");
});
