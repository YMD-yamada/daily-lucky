/**
 * 収益化: 審査済みのアフィリエイト用パラメータ／中継URLのみを想定。
 * デフォルトは手数料ゼロの「通常リンク」のまま。
 */
function applyAffiliateToItemUrl(url) {
  if (!url || typeof url !== "string") {
    return url;
  }

  const wrapper = (process.env.RAKUTEN_AFF_WRAPPER_BASE || "").trim();
  if (wrapper) {
    // 例: 楽天等が支給する「?url= + 元URL（エンコード）」型の中継ベース
    // RAKUTEN_AFF_WRAPPER_BASE=https://example.com/r?u=
    return `${wrapper}${encodeURIComponent(url)}`;
  }

  const query = (process.env.RAKUTEN_AFF_QUERY || "").trim();
  if (query && url.includes("item.rakuten.co.jp")) {
    const q = query.replace(/^\?/, "");
    return url.includes("?") ? `${url}&${q}` : `${url}?${q}`;
  }

  return url;
}

/**
 * 将来: Amazon 検索リンク等用（タグ未設定なら従来どおり）
 */
function appendAmazonTag(searchUrl) {
  const tag = (process.env.AMAZON_ASSOCIATE_TAG || "").trim();
  if (!tag || !searchUrl.includes("amazon.")) return searchUrl;
  const key = "tag=";
  if (searchUrl.includes(key)) return searchUrl;
  return searchUrl.includes("?")
    ? `${searchUrl}&tag=${encodeURIComponent(tag)}`
    : `${searchUrl}?tag=${encodeURIComponent(tag)}`;
}

module.exports = {
  applyAffiliateToItemUrl,
  appendAmazonTag,
};
