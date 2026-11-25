export const brands = [
  {
    id: "zara",
    name: "Zara",
    parent: "Inditex · Spain",
    since: "1975",
    tier: "Premium high-street",
    channel: "Stores + Online",
    color: "#24201d",
    img: "brands/zara.jpg",
  },
  {
    id: "hm",
    name: "H&M",
    parent: "H&M Group · Sweden",
    since: "1947",
    tier: "Affordable high-street",
    channel: "Stores + Online",
    color: "#a61f2b",
    img: "brands/hm.jpg",
  },
  {
    id: "azorte",
    name: "AZORTE",
    parent: "Reliance Retail · India",
    since: "2022",
    tier: "Mid-premium",
    channel: "Stores + AJIO",
    color: "#476b61",
    img: "brands/azorte.jpg",
  },
];

export const categories = [
  { key: "denim", label: "Denim" },
  { key: "dresses", label: "Dresses" },
  { key: "tops", label: "Tops" },
  { key: "ethnic", label: "Ethnic Wear" },
  { key: "kids", label: "Kids" },
  { key: "footwear", label: "Footwear" },
  { key: "accessories", label: "Accessories" },
  { key: "outerwear", label: "Outerwear" },
];

export const prices = {
  denim: {
    zara: 3290,
    hm: 2199,
    azorte: 2499,
  },

  dresses: {
    zara: 3990,
    hm: 2499,
    azorte: 2999,
  },

  tops: {
    zara: 1990,
    hm: 999,
    azorte: 1499,
  },

  ethnic: {
    zara: null,
    hm: null,
    azorte: 2799,
  },

  kids: {
    zara: 1990,
    hm: 1299,
    azorte: 1199,
  },

  footwear: {
    zara: 4290,
    hm: 2999,
    azorte: 2499,
  },

  accessories: {
    zara: 1990,
    hm: 799,
    azorte: 999,
  },

  outerwear: {
    zara: 6990,
    hm: 3999,
    azorte: 4499,
  },
};

export const assortment = {
  zara: {
    denim: 14,
    dresses: 22,
    tops: 24,
    ethnic: 0,
    kids: 8,
    footwear: 8,
    accessories: 8,
    outerwear: 16,
  },

  hm: {
    denim: 14,
    dresses: 16,
    tops: 26,
    ethnic: 0,
    kids: 16,
    footwear: 6,
    accessories: 10,
    outerwear: 12,
  },

  azorte: {
    denim: 12,
    dresses: 14,
    tops: 20,
    ethnic: 14,
    kids: 10,
    footwear: 8,
    accessories: 8,
    outerwear: 14,
  },
};

export const discounts = {
  zara: 22,
  hm: 34,
  azorte: 30,
};