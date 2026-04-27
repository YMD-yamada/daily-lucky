const COLOR_HEX = {
  赤: "#ef4444",
  青: "#3b82f6",
  黄: "#eab308",
  緑: "#22c55e",
  紫: "#a855f7",
  ピンク: "#ec4899",
  白: "#f8fafc",
  黒: "#111827",
  金: "#f59e0b",
  銀: "#94a3b8",
  オレンジ: "#f97316",
  水色: "#06b6d4",
};

function normalizeColorName(raw = "") {
  const v = String(raw).trim().toLowerCase();
  if (!v) return "白";

  if (v.includes("赤") || v.includes("red")) return "赤";
  if (v.includes("青") || v.includes("ブルー") || v.includes("blue")) return "青";
  if (v.includes("黄") || v.includes("yellow")) return "黄";
  if (v.includes("緑") || v.includes("グリーン") || v.includes("green")) return "緑";
  if (v.includes("紫") || v.includes("パープル") || v.includes("purple")) return "紫";
  if (v.includes("ピンク") || v.includes("pink")) return "ピンク";
  if (v.includes("白") || v.includes("white")) return "白";
  if (v.includes("黒") || v.includes("black")) return "黒";
  if (v.includes("金") || v.includes("gold")) return "金";
  if (v.includes("銀") || v.includes("silver")) return "銀";
  if (v.includes("オレンジ") || v.includes("orange")) return "オレンジ";
  if (v.includes("水色") || v.includes("シアン") || v.includes("cyan")) return "水色";
  return "白";
}

function resolveColor(raw) {
  const name = normalizeColorName(raw);
  return {
    colorName: name,
    colorHex: COLOR_HEX[name] || "#f8fafc",
  };
}

module.exports = {
  resolveColor,
};
