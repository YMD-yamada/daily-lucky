const TRUSTED_SITES = [
  {
    id: "vogue",
    name: "VOGUE JAPAN 占い",
    base: "https://www.vogue.co.jp/horoscope",
    searchBase: "https://www.google.com/search",
    reputation: "major-media",
  },
  {
    id: "elle",
    name: "ELLE Japan 占い",
    base: "https://www.elle.com/jp/horoscope/",
    searchBase: "https://www.google.com/search",
    reputation: "major-media",
  },
  {
    id: "spur",
    name: "SPUR 占い",
    base: "https://spur.hpplus.jp/fortune/",
    searchBase: "https://www.google.com/search",
    reputation: "major-media",
  },
];

function buildReferenceLinks(sign, dateText) {
  return TRUSTED_SITES.map((site) => {
    const q = `site:${new URL(site.base).hostname} ${dateText} 占い ${sign}`;
    const searchUrl = `${site.searchBase}?q=${encodeURIComponent(q)}`;
    return {
      id: site.id,
      name: site.name,
      homepage: site.base,
      searchUrl,
      reputation: site.reputation,
    };
  });
}

function buildCredibility(sign, dateText) {
  const refs = buildReferenceLinks(sign, dateText);
  return {
    score: Math.min(100, 65 + refs.length * 10),
    note: `主要メディア${refs.length}件を参照`,
    references: refs,
  };
}

module.exports = {
  TRUSTED_SITES,
  buildReferenceLinks,
  buildCredibility,
};
