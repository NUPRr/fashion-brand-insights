import { useState } from "react";
import { products } from "./products";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

import {
  brands,
  categories,
  prices,
  assortment,
  discounts,
} from "./data";

import "./App.css";

const img = (p) => `/fashion-images/${p}`;

const inr = (n) =>
  n ? "₹" + Number(n).toLocaleString("en-IN") : "—";

const bg = (p, fallback) => ({
  backgroundColor: fallback,
  backgroundImage: `url(${img(p)})`,
});

const CAT_COLORS = [
  "#29231f",
  "#9b7658",
  "#b89578",
  "#687d72",
  "#c78f93",
  "#77716b",
  "#8c9678",
  "#625a54",
];

const common = categories.filter(
  (c) =>
    prices[c.key]?.zara &&
    prices[c.key]?.hm &&
    prices[c.key]?.azorte
);

const avg = (id) =>
  common.reduce(
    (sum, c) => sum + prices[c.key][id],
    0
  ) / common.length;

const vsZara = Math.round(
  (avg("azorte") / avg("zara") - 1) * 100
);

const vsHM = Math.round(
  (avg("azorte") / avg("hm") - 1) * 100
);

const word = (n) =>
  n < 0 ? "cheaper than" : "pricier than";

const ethnic = brands
  .filter((b) => assortment[b.id]?.ethnic > 0)
  .map((b) => b.name);

const topDisc = brands.reduce((a, b) =>
  discounts[b.id] > discounts[a.id] ? b : a
);

const productBrands = [
  ...new Set(products.map((p) => p.brand)),
];

const productCategories = [
  ...new Set(products.map((p) => p.category)),
];

const totalProducts = products.length;

const brandProducts = (brand) =>
  products.filter((p) => p.brand === brand);

export default function App() {
  const [cat, setCat] = useState("Denim");
  const [selectedBrand, setSelectedBrand] = useState(null);

  const [productBrand, setProductBrand] = useState("All");
  const [productCategory, setProductCategory] =
    useState("All");
  const [discountFilter, setDiscountFilter] =
    useState("All");
  const [productSearch, setProductSearch] =
    useState("");

  const current = productCategories.includes(cat)
    ? {
        key: cat,
        label: cat,
      }
    : {
        key: productCategories[0],
        label: productCategories[0],
      };

  const priceData = brands.map((b) => {
    const items = products.filter(
      (p) =>
        p.brand === b.name &&
        p.category === current.label
    );

    const average = items.length
      ? Math.round(
          items.reduce(
            (sum, p) => sum + p.price,
            0
          ) / items.length
        )
      : 0;

    return {
      name: b.name,
      price: average,
      color: b.color,
    };
  });

  const missing = priceData
    .filter((d) => !d.price)
    .map((d) => d.name);

  const assortData = brands.map((b) => {
    const brandItems = products.filter(
      (p) => p.brand === b.name
    );

    const total = brandItems.length;

    const result = {
      name: b.name,
    };

    productCategories.forEach((category) => {
      const count = brandItems.filter(
        (p) => p.category === category
      ).length;

      result[category] = total
        ? Math.round((count / total) * 100)
        : 0;
    });

    return result;
  });

  const discData = brands.map((b) => {
    const items = products.filter(
      (p) => p.brand === b.name
    );

    const average = items.length
      ? Math.round(
          items.reduce(
            (sum, p) => sum + p.discount,
            0
          ) / items.length
        )
      : 0;

    return {
      name: b.name,
      discount: average,
      color: b.color,
    };
  });

  const filteredProducts = products.filter((p) => {
    const brandMatch =
      productBrand === "All" ||
      p.brand === productBrand;

    const categoryMatch =
      productCategory === "All" ||
      p.category === productCategory;

    const discountMatch =
      discountFilter === "All" ||
      (discountFilter === "Discounted" &&
        p.discount > 0) ||
      (discountFilter === "No Discount" &&
        p.discount === 0);

    const searchMatch =
      p.product
        .toLowerCase()
        .includes(productSearch.toLowerCase()) ||
      p.brand
        .toLowerCase()
        .includes(productSearch.toLowerCase()) ||
      p.category
        .toLowerCase()
        .includes(productSearch.toLowerCase());

    return (
      brandMatch &&
      categoryMatch &&
      discountMatch &&
      searchMatch
    );
  });

  const avgFilteredPrice = filteredProducts.length
    ? Math.round(
        filteredProducts.reduce(
          (sum, p) => sum + p.price,
          0
        ) / filteredProducts.length
      )
    : 0;

  const avgFilteredDiscount =
    filteredProducts.length
      ? Math.round(
          filteredProducts.reduce(
            (sum, p) => sum + p.discount,
            0
          ) / filteredProducts.length
        )
      : 0;

  const lowestFilteredPrice =
    filteredProducts.length
      ? Math.min(
          ...filteredProducts.map((p) => p.price)
        )
      : 0;

  const brandAveragePrices = brands
    .map((b) => {
      const items = brandProducts(b.name);

      return {
        name: b.name,
        average: items.length
          ? Math.round(
              items.reduce(
                (sum, p) => sum + p.price,
                0
              ) / items.length
            )
          : 0,
      };
    })
    .filter((b) => b.average > 0);

  const mostAffordable =
    [...brandAveragePrices].sort(
      (a, b) => a.average - b.average
    )[0];

  const ethnicOpportunity = brands
    .map((b) => {
      const items = brandProducts(b.name);

      const ethnicCount = items.filter(
        (p) => p.category === "Ethnic Wear"
      ).length;

      return {
        name: b.name,
        count: ethnicCount,
        share: items.length
          ? Math.round(
              (ethnicCount / items.length) * 100
            )
          : 0,
      };
    })
    .sort((a, b) => b.share - a.share)[0];

  const highestProductDiscount =
    [...discData].sort(
      (a, b) => b.discount - a.discount
    )[0];

  return (
    <>
      <header className="nav">
        <div className="nav-in">
          <div className="logo">
            Fashion<span>IQ</span>
          </div>

          <nav className="links">
            <a href="#overview">Overview</a>
            <a href="#brands">Brands</a>
            <a href="#prices">Pricing</a>
            <a href="#assortment">Assortment</a>
            <a href="#discounts">Discounts</a>
            <a href="#insights">Insights</a>
            <a href="#products">Products</a>
          </nav>
        </div>
      </header>

      <section
        id="overview"
        className="hero"
        style={bg("hero/hero.jpg", "#211d1a")}
      >
        <div className="hero-overlay" />

        <div className="hero-in">
          <div className="kicker">
            Fashion Market Intelligence
          </div>

          <h1>
            Competitive intelligence for
            <span> modern fashion retail.</span>
          </h1>

          <p>
            Compare pricing, assortment and promotional
            strategy across Zara, H&M and AZORTE.
          </p>

          <div className="hero-actions">
            <a className="btn" href="#brands">
              Explore brands
            </a>

            <a
              className="text-link"
              href="#insights"
            >
              View insights →
            </a>
          </div>
        </div>
      </section>

      <section className="kpi-wrap">
        <div className="kpi-grid">
          <div className="kpi">
            <div className="kpi-label">
              AZORTE VS ZARA
            </div>

            <div className="kpi-number">
              {Math.abs(vsZara)}%
            </div>

            <div className="kpi-sub">
              {word(vsZara)} Zara on comparable
              categories
            </div>
          </div>

          <div className="kpi">
            <div className="kpi-label">
              AZORTE VS H&M
            </div>

            <div className="kpi-number">
              {Math.abs(vsHM)}%
            </div>

            <div className="kpi-sub">
              {word(vsHM)} H&M on comparable
              categories
            </div>
          </div>

          <div className="kpi">
            <div className="kpi-label">
              HIGHEST DISCOUNT
            </div>

            <div className="kpi-number">
              {discounts[topDisc.id]}%
            </div>

            <div className="kpi-sub">
              {topDisc.name} has the highest
              markdown
            </div>
          </div>

          <div className="kpi">
            <div className="kpi-label">
              ETHNIC COVERAGE
            </div>

            <div className="kpi-number">
              {ethnic.length}/3
            </div>

            <div className="kpi-sub">
              brands represented in the sample
            </div>
          </div>
        </div>
      </section>

      <section id="brands" className="wrap">
        <div className="section-heading">
          <div>
            <div className="eyebrow">
              COMPETITIVE LANDSCAPE
            </div>

            <h2>Brand comparison</h2>

            <p className="lead">
              Select a brand to view its competitive
              profile.
            </p>
          </div>
        </div>

        <div className="brand-grid">
          {brands.map((b) => (
            <button
              className="brand-card"
              key={b.id}
              onClick={() => setSelectedBrand(b)}
            >
              <div
                className="brand-image"
                style={bg(b.img, b.color)}
              >
                <div className="brand-image-overlay" />

                <span
                  className="brand-tier"
                  style={{
                    background: b.color,
                  }}
                >
                  {b.tier}
                </span>

                <span className="view-profile">
                  View analysis →
                </span>
              </div>

              <div className="brand-content">
                <h3>{b.name}</h3>

                <p>{b.parent}</p>

                <div className="brand-meta">
                  <span>
                    Founded
                    <b>{b.since}</b>
                  </span>

                  <span>
                    Channel
                    <b>{b.channel}</b>
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section id="prices" className="wrap">
        <div className="section-heading">
          <div>
            <div className="eyebrow">
              PRICE INTELLIGENCE
            </div>

            <h2>Price comparison</h2>

            <p className="lead">
              Compare average observed prices by
              category.
            </p>
          </div>

          <span className="data-status">
            ● Illustrative dataset
          </span>
        </div>

        <div className="tiles">
          {productCategories.map((category) => (
            <button
              key={category}
              className={
                "tile" +
                (category === cat
                  ? " active"
                  : "")
              }
              style={bg(
                `categories/${
                  category === "Ethnic Wear"
                    ? "ethnic"
                    : category
                        .toLowerCase()
                        .replace(" ", "-")
                }.jpg`,
                "#d9cfc1"
              )}
              onClick={() => setCat(category)}
            >
              <span>{category}</span>
            </button>
          ))}
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h3>Average price</h3>
              <p>{current.label}</p>
            </div>

            <div className="chart-context">
              INR · per item
            </div>
          </div>

          <div className="chart">
            <ResponsiveContainer>
              <BarChart data={priceData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e7e0d8"
                />

                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tickFormatter={(v) =>
                    "₹" + v
                  }
                  width={70}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  formatter={(v) => inr(v)}
                  contentStyle={{
                    borderRadius: "10px",
                    border:
                      "1px solid #e3dcd2",
                  }}
                />

                <Bar
                  dataKey="price"
                  radius={[8, 8, 0, 0]}
                >
                  {priceData.map((d) => (
                    <Cell
                      key={d.name}
                      fill={d.color}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {missing.length > 0 && (
            <p className="note">
              Not represented in this sample:{" "}
              {missing.join(", ")}.
            </p>
          )}
        </div>
      </section>

      <section
        id="assortment"
        className="wrap"
      >
        <div className="section-heading">
          <div>
            <div className="eyebrow">
              PRODUCT PORTFOLIO
            </div>

            <h2>Assortment mix</h2>

            <p className="lead">
              Product category distribution across
              the brands.
            </p>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart assortment-chart">
            <ResponsiveContainer>
              <BarChart data={assortData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e7e0d8"
                />

                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tickFormatter={(v) =>
                    v + "%"
                  }
                  domain={[0, 100]}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  formatter={(v) => v + "%"}
                />

                <Legend />

                {productCategories.map(
                  (category, i) => (
                    <Bar
                      key={category}
                      dataKey={category}
                      name={category}
                      stackId="a"
                      fill={
                        CAT_COLORS[
                          i %
                            CAT_COLORS.length
                        ]
                      }
                    />
                  )
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section
        id="discounts"
        className="wrap"
      >
        <div className="section-heading">
          <div>
            <div className="eyebrow">
              PROMOTIONAL INTELLIGENCE
            </div>

            <h2>Discount strategy</h2>

            <p className="lead">
              Compare average markdown levels
              across brands.
            </p>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart discount-chart">
            <ResponsiveContainer>
              <BarChart data={discData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e7e0d8"
                />

                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tickFormatter={(v) =>
                    v + "%"
                  }
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  formatter={(v) => v + "%"}
                />

                <Bar
                  dataKey="discount"
                  radius={[8, 8, 0, 0]}
                >
                  {discData.map((d) => (
                    <Cell
                      key={d.name}
                      fill={d.color}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section
        id="insights"
        className="wrap"
      >
        <div className="section-heading">
          <div>
            <div className="eyebrow">
              EXECUTIVE INSIGHTS
            </div>

            <h2>What the data suggests</h2>

            <p className="lead">
              Key competitive signals from the
              current product dataset.
            </p>
          </div>
        </div>

        <div className="insights-grid">
          <article className="insight-card">
            <span className="insight-number">
              01
            </span>

            <div className="insight-label">
              PRICE POSITION
            </div>

            <h3>
              {mostAffordable
                ? `${mostAffordable.name} leads on affordability`
                : "Pricing data unavailable"}
            </h3>

            <p>
              The lowest average observed product
              price indicates the strongest
              affordability position in the current
              dataset.
            </p>

            <div className="insight-stat">
              <span>
                Lowest average price
              </span>

              <strong>
                {mostAffordable
                  ? inr(
                      mostAffordable.average
                    )
                  : "—"}
              </strong>
            </div>
          </article>

          <article className="insight-card">
            <span className="insight-number">
              02
            </span>

            <div className="insight-label">
              ETHNIC OPPORTUNITY
            </div>

            <h3>
              {ethnicOpportunity &&
              ethnicOpportunity.share > 0
                ? `${ethnicOpportunity.name} has the strongest ethnic presence`
                : "Ethnic wear remains underrepresented"}
            </h3>

            <p>
              Ethnic Wear represents a smaller
              part of the current assortment,
              creating a potential category
              opportunity.
            </p>

            <div className="insight-stat">
              <span>
                Ethnic assortment
              </span>

              <strong>
                {
                  products.filter(
                    (p) =>
                      p.category ===
                      "Ethnic Wear"
                  ).length
                }{" "}
                products
              </strong>
            </div>
          </article>

          <article className="insight-card">
            <span className="insight-number">
              03
            </span>

            <div className="insight-label">
              DISCOUNT PRESSURE
            </div>

            <h3>
              {highestProductDiscount
                ? `${highestProductDiscount.name} shows the highest discount pressure`
                : "Discount data unavailable"}
            </h3>

            <p>
              Higher average discounts may indicate
              stronger promotional activity or
              greater price competition within the
              assortment.
            </p>

            <div className="insight-stat">
              <span>
                Highest average discount
              </span>

              <strong>
                {highestProductDiscount
                  ? `${highestProductDiscount.discount}%`
                  : "—"}
              </strong>
            </div>
          </article>
        </div>
      </section>

      <section
        id="products"
        className="wrap"
      >
        <div className="section-heading product-heading">
          <div>
            <div className="eyebrow">
              PRODUCT INTELLIGENCE
            </div>

            <h2>
              Product-level comparison
            </h2>

            <p className="lead">
              Compare observed products, prices
              and markdowns across competitors.
            </p>
          </div>

          <span className="data-status">
            ● {totalProducts} products tracked
          </span>
        </div>

        <div className="product-controls">
          <input
            type="text"
            placeholder="Search products..."
            value={productSearch}
            onChange={(e) =>
              setProductSearch(
                e.target.value
              )
            }
          />

          <select
            value={productBrand}
            onChange={(e) =>
              setProductBrand(
                e.target.value
              )
            }
          >
            <option value="All">
              All Brands
            </option>

            {productBrands.map(
              (brand) => (
                <option
                  key={brand}
                  value={brand}
                >
                  {brand}
                </option>
              )
            )}
          </select>

          <select
            value={productCategory}
            onChange={(e) =>
              setProductCategory(
                e.target.value
              )
            }
          >
            <option value="All">
              All Categories
            </option>

            {productCategories.map(
              (category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              )
            )}
          </select>

          <select
            value={discountFilter}
            onChange={(e) =>
              setDiscountFilter(
                e.target.value
              )
            }
          >
            <option value="All">
              All Discounts
            </option>

            <option value="Discounted">
              Discounted
            </option>

            <option value="No Discount">
              No Discount
            </option>
          </select>
        </div>

        <div className="product-kpis">
          <div>
            <span>PRODUCTS</span>
            <strong>
              {filteredProducts.length}
            </strong>
          </div>

          <div>
            <span>AVG. PRICE</span>
            <strong>
              {inr(avgFilteredPrice)}
            </strong>
          </div>

          <div>
            <span>AVG. DISCOUNT</span>
            <strong>
              {avgFilteredDiscount}%
            </strong>
          </div>

          <div>
            <span>LOWEST PRICE</span>
            <strong>
              {inr(
                lowestFilteredPrice
              )}
            </strong>
          </div>
        </div>

        <div className="product-table-card">
          <div className="product-table-head">
            <span>Product</span>
            <span>Brand</span>
            <span>Category</span>
            <span>Price</span>
            <span>Discount</span>
            <span>Collection</span>
            <span>Observed</span>
          </div>

          {filteredProducts.length > 0 ? (
            filteredProducts.map((p) => (
              <div
                className="product-row"
                key={p.id}
              >
                <strong>
                  {p.product}
                </strong>

                <span>
                  {p.brand}
                </span>

                <span>
                  {p.category}
                </span>

                <span>
                  {inr(p.price)}
                </span>

                <span
                  className={
                    p.discount > 0
                      ? "discount-value"
                      : ""
                  }
                >
                  {p.discount}%
                </span>

                <span>
                  {p.collection}
                </span>

                <span>
                  {p.date}
                </span>
              </div>
            ))
          ) : (
            <div className="empty-products">
              No products match the selected
              filters.
            </div>
          )}
        </div>
      </section>

      <section
        id="method"
        className="wrap method"
      >
        <div className="method-card">
          <div>
            <div className="eyebrow">
              DATA & METHODOLOGY
            </div>

            <h2>
              About this analysis
            </h2>
          </div>

          <div>
            <p>
              FashionIQ is a competitive
              fashion intelligence dashboard
              designed to compare pricing,
              assortment and promotional
              strategy.
            </p>

            <ul>
              <li>
                Brand facts are based on
                publicly available company
                information.
              </li>

              <li>
                Current prices, assortment
                shares and discounts are
                illustrative.
              </li>

              <li>
                Product-level records include
                product, category, price,
                discount, collection and
                observation date.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <footer className="foot">
        <strong>FashionIQ</strong>

        <span>
          Competitive Fashion Intelligence
          Dashboard · Nupoor Naik
        </span>
      </footer>

      {selectedBrand && (
        <div
          className="modal-backdrop"
          onClick={() =>
            setSelectedBrand(null)
          }
        >
          <div
            className="brand-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <button
              className="close"
              onClick={() =>
                setSelectedBrand(null)
              }
            >
              ×
            </button>

            <div
              className="modal-image"
              style={bg(
                selectedBrand.img,
                selectedBrand.color
              )}
            />

            <div className="modal-content">
              <span
                className="modal-tier"
                style={{
                  background:
                    selectedBrand.color,
                }}
              >
                {selectedBrand.tier}
              </span>

              <h2>
                {selectedBrand.name}
              </h2>

              <p className="modal-parent">
                {selectedBrand.parent}
              </p>

              <div className="profile-grid">
                <div>
                  <span>Founded</span>

                  <strong>
                    {selectedBrand.since}
                  </strong>
                </div>

                <div>
                  <span>Channel</span>

                  <strong>
                    {selectedBrand.channel}
                  </strong>
                </div>

                <div>
                  <span>
                    Avg. discount
                  </span>

                  <strong>
                    {discounts[
                      selectedBrand.id
                    ]}%
                  </strong>
                </div>

                <div>
                  <span>
                    Ethnic assortment
                  </span>

                  <strong>
                    {
                      assortment[
                        selectedBrand.id
                      ].ethnic
                    }%
                  </strong>
                </div>
              </div>

              <div className="modal-section">
                <h3>
                  Competitive profile
                </h3>

                <p>
                  {selectedBrand.id ===
                  "azorte"
                    ? "AZORTE occupies a differentiated position in this sample through mid-premium pricing and ethnic assortment coverage."
                    : selectedBrand.id ===
                      "zara"
                    ? "Zara represents the higher-priced benchmark in the comparable-category sample and provides a premium high-street reference point."
                    : "H&M represents the lower-priced benchmark across several comparable categories and has the highest promotional intensity in the sample."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}