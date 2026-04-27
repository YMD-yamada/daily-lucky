const axios = require("axios");

const SIGNS = [
  "牡羊座",
  "牡牛座",
  "双子座",
  "蟹座",
  "獅子座",
  "乙女座",
  "天秤座",
  "蠍座",
  "射手座",
  "山羊座",
  "水瓶座",
  "魚座",
];

const COLORS = ["赤", "青", "黄", "緑", "紫", "ピンク", "白", "黒", "金", "銀", "オレンジ", "水色"];
const ITEMS = ["ノート", "マグカップ", "ボールペン", "トートバッグ", "腕時計", "イヤホン", "ハンドクリーム", "ブックカバー", "水筒", "キーホルダー", "ポーチ", "タオル"];

function formatDateJst(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}/${m}/${d}`;
}

function createFallbackData(date) {
  const seed = Number(date.replace(/\//g, ""));
  const list = SIGNS.map((sign, idx) => {
    const rank = ((idx * 7 + seed) % 12) + 1;
    return {
      rank,
      sign,
      total: 60 + ((seed + idx * 13) % 40),
      item: ITEMS[(seed + idx) % ITEMS.length],
      color: COLORS[(seed + idx * 3) % COLORS.length],
      content: "外部API障害時のフォールバック結果です。",
      source: "fallback",
    };
  });
  return list.sort((a, b) => a.rank - b.rank);
}

function createAstroModelData(date) {
  const seed = Number(date.replace(/\//g, "")) + 97;
  const list = SIGNS.map((sign, idx) => {
    const rank = ((idx * 5 + seed) % 12) + 1;
    return {
      rank,
      sign,
      total: 55 + ((seed + idx * 17) % 45),
      item: ITEMS[(seed + idx * 2) % ITEMS.length],
      color: COLORS[(seed + idx * 5) % COLORS.length],
      content: "補助ソースによるスコアです。",
      source: "astro-model",
    };
  });
  return list.sort((a, b) => a.rank - b.rank);
}

function mergeSources(primary, secondary) {
  const bySignSecondary = new Map(secondary.map((v) => [v.sign, v]));
  const merged = primary.map((a) => {
    const b = bySignSecondary.get(a.sign);
    if (!b) return { ...a, mergedScore: (13 - a.rank) * 10 + a.total / 10, sourcesUsed: [a.source] };
    const scoreA = (13 - a.rank) * 10 + a.total / 10;
    const scoreB = (13 - b.rank) * 7 + b.total / 12;
    return {
      ...a,
      mergedScore: scoreA + scoreB,
      // primary item/color is kept for consistency
      sourcesUsed: [a.source, b.source],
    };
  });

  merged.sort((x, y) => y.mergedScore - x.mergedScore);
  return merged.map((v, idx) => ({
    ...v,
    rank: idx + 1,
  }));
}

async function getDailyHoroscope(sign = "") {
  const date = formatDateJst();
  const url = `https://api.jugemkey.jp/api/horoscope/free/${date}`;

  let normalizedPrimary;
  const modelData = createAstroModelData(date);
  try {
    const response = await axios.get(url, { timeout: 10000 });
    const list = response?.data?.horoscope?.[date];
    if (!Array.isArray(list)) {
      throw new Error("占いデータ形式が不正です");
    }
    normalizedPrimary = list.map((v) => ({
      rank: Number(v.rank),
      sign: v.sign,
      total: Number(v.total),
      item: v.item || "ラッキーアイテム情報なし",
      color: v.color || "不明",
      content: v.content || "",
      source: "api",
    }));
  } catch (error) {
    console.warn(`[horoscope] api unavailable, fallback used: ${error.message}`);
    normalizedPrimary = createFallbackData(date);
  }

  const merged = mergeSources(normalizedPrimary, modelData);
  const filtered = sign ? merged.filter((v) => v.sign === sign) : merged;
  return filtered.sort((a, b) => a.rank - b.rank);
}

module.exports = {
  getDailyHoroscope,
  createFallbackData,
  SIGNS,
};
