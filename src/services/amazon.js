const PRODUCT_BUCKETS = [
  {
    key: "note",
    keywords: ["ノート", "メモ"],
    candidates: [
      { id: "note-n295", provider: "楽天市場", name: "マルマン ニーモシネ A5 ノート", reason: "書き心地がよくレビューも安定", url: "https://item.rakuten.co.jp/artandpaperm/n295/" },
      { id: "note-legalpad", provider: "楽天市場", name: "A5 リーガルパッド メモ", reason: "メモ用途で使いやすく価格が手頃", url: "https://item.rakuten.co.jp/knox/10002846/" },
    ],
  },
  {
    key: "mug",
    keywords: ["マグ", "カップ"],
    candidates: [
      { id: "mug-nordic-390", provider: "楽天市場", name: "北欧デザイン マグカップ 390ml", reason: "日常使いしやすい容量", url: "https://item.rakuten.co.jp/shop-erina/shop-erina2026040419205578674150/" },
      { id: "mug-macaron-set", provider: "楽天市場", name: "マカロン色 マグカップ4個セット", reason: "まとめ買い向けでコスパが高い", url: "https://item.rakuten.co.jp/takami-store/takami-sto2026040317360362526515/" },
    ],
  },
  {
    key: "pen",
    keywords: ["ボールペン", "ペン"],
    candidates: [
      { id: "pen-jetstream-41", provider: "楽天市場", name: "ジェットストリーム 4&1", reason: "実用性が高い定番モデル", url: "https://item.rakuten.co.jp/hankoya-shop/jetstream-4105/" },
      { id: "pen-jetstream-otobe", provider: "楽天市場", name: "ジェットストリーム 4&1 0.5mm", reason: "贈り物向けでも人気", url: "https://item.rakuten.co.jp/hanko-otobe/msxe5-1000-05/" },
    ],
  },
  {
    key: "tote",
    keywords: ["トート"],
    candidates: [
      { id: "tote-rth90029", provider: "楽天市場", name: "キャンバストートバッグ A4", reason: "通勤通学向けで実用的", url: "https://item.rakuten.co.jp/plenty-one/rth90029/" },
      { id: "tote-jw010", provider: "楽天市場", name: "厚手キャンバストート JW010", reason: "収納多めで使いやすい", url: "https://item.rakuten.co.jp/yokoaki/jw010/" },
    ],
  },
  {
    key: "watch",
    keywords: ["腕時計", "時計"],
    candidates: [
      { id: "watch-casio-lf30w", provider: "楽天市場", name: "CASIO スタンダード LF-30W-1A", reason: "軽量で日常使いに向く", url: "https://item.rakuten.co.jp/aruim/lf-30w-1a/" },
      { id: "watch-citizen-eco", provider: "楽天市場", name: "CITIZEN Eco-Drive AR3074-03A", reason: "ソーラー駆動で長期利用向け", url: "https://item.rakuten.co.jp/tokia/ar3074-03a/" },
    ],
  },
  {
    key: "earphone",
    keywords: ["イヤホン"],
    candidates: [
      { id: "earphone-qkz-ak6", provider: "楽天市場", name: "QKZ-AK6 有線イヤホン", reason: "低価格帯でバランスが良い", url: "https://item.rakuten.co.jp/one-daze/qkz-ak6/" },
      { id: "earphone-elecom-hs", provider: "楽天市場", name: "エレコム 有線ヘッドセット", reason: "通話用途でも使いやすい", url: "https://item.rakuten.co.jp/kaitocorporation/20250605230545_78/" },
    ],
  },
  {
    key: "handcream",
    keywords: ["ハンドクリーム"],
    candidates: [
      { id: "handcream-curel", provider: "楽天市場", name: "Curel 潤浸保湿ハンドクリーム 50g", reason: "保湿ケアの定番", url: "https://item.rakuten.co.jp/daikishop/curel6262/" },
      { id: "handcream-awesome", provider: "楽天市場", name: "エクラオーサム ハンドエッセンス", reason: "べたつきにくく使いやすい", url: "https://item.rakuten.co.jp/ark-labo/10000058/" },
    ],
  },
  {
    key: "bookcover",
    keywords: ["ブックカバー", "手帳カバー"],
    candidates: [
      { id: "bookcover-sion", provider: "楽天市場", name: "SION 日本製ブックカバー", reason: "サイズ対応が広い", url: "https://item.rakuten.co.jp/tees-factory/sion_b_main/" },
      { id: "bookcover-gamaguchi", provider: "楽天市場", name: "がま口ブックカバー 文庫/A6", reason: "デザイン性と実用性の両立", url: "https://item.rakuten.co.jp/ayano-koji/c-book-c-bc/" },
    ],
  },
  {
    key: "bottle",
    keywords: ["水筒", "ボトル"],
    candidates: [
      { id: "bottle-tiger-mmz", provider: "楽天市場", name: "タイガー 真空断熱ボトル 500ml", reason: "保温保冷性能が高い", url: "https://item.rakuten.co.jp/irodorioutdoor/22410125/" },
      { id: "bottle-thermos-jnl", provider: "楽天市場", name: "THERMOS 真空断熱ケータイマグ", reason: "軽量で持ち運びしやすい", url: "https://item.rakuten.co.jp/awaspo/jnl-s500/" },
    ],
  },
  {
    key: "keyholder",
    keywords: ["キーホルダー", "キーリング"],
    candidates: [
      { id: "keyholder-lasiem", provider: "楽天市場", name: "LASIEM 本革キーホルダー", reason: "品質と価格のバランスが良い", url: "https://item.rakuten.co.jp/morevalue/nk15/" },
      { id: "keyholder-inokura", provider: "楽天市場", name: "伊の蔵レザー キーホルダーS", reason: "カスタム性が高く長く使える", url: "https://item.rakuten.co.jp/inokura/keyholder-2/" },
    ],
  },
  {
    key: "pouch",
    keywords: ["ポーチ", "コスメ"],
    candidates: [
      { id: "pouch-elegante", provider: "楽天市場", name: "Elegante コスメポーチ", reason: "仕切り付きで整理しやすい", url: "https://item.rakuten.co.jp/kintsu/ele-pouch-004/" },
      { id: "pouch-vertical", provider: "楽天市場", name: "縦型 自立コスメポーチ", reason: "持ち運びやすく旅行向け", url: "https://item.rakuten.co.jp/exrevo-2/po-83c/" },
    ],
  },
  {
    key: "towel",
    keywords: ["タオル"],
    candidates: [
      { id: "towel-daily-10000281", provider: "楽天市場", name: "日本製デイリーフェイスタオル", reason: "吸水性が高く日常向け", url: "https://item.rakuten.co.jp/toucher-home/10000281/" },
      { id: "towel-imabari-rib", provider: "楽天市場", name: "今治 ふわふわリブタオル", reason: "肌触り重視の人に向く", url: "https://item.rakuten.co.jp/toucher-home/c/0000000263/" },
    ],
  },
];

const { applyAffiliateToItemUrl } = require("./monetization");

const FALLBACK = PRODUCT_BUCKETS[0].candidates[0];
const IMAGE_BY_BUCKET = {
  note: "https://openmoji.org/data/color/svg/1F4D3.svg",
  mug: "https://openmoji.org/data/color/svg/2615.svg",
  pen: "https://openmoji.org/data/color/svg/1F58A.svg",
  tote: "https://openmoji.org/data/color/svg/1F45C.svg",
  watch: "https://openmoji.org/data/color/svg/231A.svg",
  earphone: "https://openmoji.org/data/color/svg/1F3A7.svg",
  handcream: "https://openmoji.org/data/color/svg/1F9F4.svg",
  bookcover: "https://openmoji.org/data/color/svg/1F4D5.svg",
  bottle: "https://openmoji.org/data/color/svg/1F9C3.svg",
  keyholder: "https://openmoji.org/data/color/svg/1F511.svg",
  pouch: "https://openmoji.org/data/color/svg/1F45D.svg",
  towel: "https://openmoji.org/data/color/svg/1F9FA.svg",
  fallback: "https://openmoji.org/data/color/svg/1F31F.svg",
};

function pickBucket(itemName = "") {
  const normalized = itemName.trim();
  return PRODUCT_BUCKETS.find((bucket) => bucket.keywords.some((k) => normalized.includes(k))) || null;
}

function hashNum(input) {
  let h = 0;
  for (let i = 0; i < input.length; i += 1) h = (h * 31 + input.charCodeAt(i)) % 100000;
  return h;
}

function chooseByClicks(candidates, metrics, dateKey) {
  const clicks = metrics?.clicksByProductId || {};
  let best = candidates[0];
  let bestScore = -Infinity;
  for (const c of candidates) {
    const base = clicks[c.id] || 0;
    const explore = (hashNum(`${dateKey}:${c.id}`) % 10) / 100;
    const score = base + explore;
    if (score > bestScore) {
      best = c;
      bestScore = score;
    }
  }
  return best;
}

function buildProductLink(itemName = "", options = {}) {
  const bucket = pickBucket(itemName);
  const dateKey = options.dateKey || new Date().toISOString().slice(0, 10);
  const preferredProductId = options.preferredProductId || "";
  const metrics = options.metrics || null;

  if (!bucket) {
    return {
      keywordKey: "fallback",
      productId: FALLBACK.id,
      provider: FALLBACK.provider,
      name: FALLBACK.name,
      reason: "該当商品がないため定番商品を表示",
      productUrl: applyAffiliateToItemUrl(FALLBACK.url),
      imageUrl: IMAGE_BY_BUCKET.fallback,
    };
  }

  const forced = bucket.candidates.find((c) => c.id === preferredProductId);
  const picked = forced || chooseByClicks(bucket.candidates, metrics, dateKey);

  return {
    keywordKey: bucket.key,
    productId: picked.id,
    provider: picked.provider,
    name: picked.name,
    reason: forced ? `${picked.reason}（実績最適化で選出）` : picked.reason,
    productUrl: applyAffiliateToItemUrl(picked.url),
    imageUrl: IMAGE_BY_BUCKET[bucket.key] || IMAGE_BY_BUCKET.fallback,
  };
}

function getCatalogBuckets() {
  return PRODUCT_BUCKETS;
}

module.exports = { buildProductLink, getCatalogBuckets };
