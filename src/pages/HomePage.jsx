import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { getHotGoods, searchGoods, getCategories } from "../services/goodService";
import { SearchOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";

const CAROUSEL_ITEMS = [
  { title: "新品首发", subtitle: "春季新款限时特惠" },
  { title: "数码好物", subtitle: "智能生活由此开始" },
  { title: "限时折扣", subtitle: "精选商品低至7折" },
];

const CATEGORY_ICONS = {
  "c001": "💻",
  "c002": "👕",
  "c003": "🍔",
  "c004": "🏠",
};

export default function HomePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [goods, setGoods] = useState([]);
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [categories, setCategories] = useState([]);
  const [allGoods, setAllGoods] = useState([]);

  useEffect(() => {
    const hotGoods = getHotGoods();
    setGoods(hotGoods);
    setAllGoods(hotGoods);
    setCategories(getCategories());
  }, []);

  useEffect(() => {
    const state = location.state;
    if (state && state.searchKeyword) {
      const trimmed = state.searchKeyword.trim();
      setKeyword(trimmed);
      const results = searchGoods(trimmed);
      setGoods(results);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIdx((prev) => (prev + 1) % CAROUSEL_ITEMS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = () => {
    const trimmed = keyword.trim();
    if (!trimmed) {
      setGoods(allGoods);
      return;
    }
    const results = searchGoods(trimmed);
    setGoods(results);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="home-page">
      {/* ===== 移动端布局 ===== */}
      <div className="home-hero">
        <h1>商城</h1>
        <p>发现你喜欢的每一件好物</p>
      </div>

      <div className="search-bar-wrap">
        <SearchOutlined className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="搜索商品"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      <div className="carousel-wrap">
        <div className="carousel-inner">
          <h2>{CAROUSEL_ITEMS[carouselIdx].title}</h2>
          <p>{CAROUSEL_ITEMS[carouselIdx].subtitle}</p>
        </div>
        <div className="carousel-dots">
          {CAROUSEL_ITEMS.map((_, idx) => (
            <div
              key={idx}
              className={`carousel-dot${idx === carouselIdx ? " active" : ""}`}
            />
          ))}
        </div>
      </div>

      <div className="section-header">
        <h2>{keyword ? "搜索结果" : "热门商品"}</h2>
      </div>

      {goods.length > 0 ? (
        <div className="goods-grid">
          {goods.map((good) => (
            <ProductCard key={good.id} product={good} />
          ))}
        </div>
      ) : (
        <div className="goods-empty">暂无相关商品</div>
      )}

      {/* ===== 桌面端布局 ===== */}
      <div className="home-desktop-layout">
        <div className="home-desktop-main">
          <div className="home-desktop-banner">
            <div>
              <h2>{CAROUSEL_ITEMS[carouselIdx].title}</h2>
              <p>{CAROUSEL_ITEMS[carouselIdx].subtitle}</p>
            </div>
            <div className="home-desktop-banner-emoji">🛍️</div>
          </div>

          <div className="home-desktop-categories">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="home-desktop-cat-item"
                onClick={() => navigate(`/category?cat=${cat.id}`)}
              >
                <span>{CATEGORY_ICONS[cat.id] || "📦"}</span>
                <span>{cat.name}</span>
              </div>
            ))}
          </div>

          <h3 className="home-desktop-section-title">
            {keyword ? "搜索结果" : "热门推荐"}
          </h3>

          {goods.length > 0 ? (
            <div className="goods-grid">
              {goods.map((good) => (
                <ProductCard key={good.id} product={good} />
              ))}
            </div>
          ) : (
            <div className="goods-empty">暂无相关商品</div>
          )}
        </div>

        <aside className="home-desktop-sidebar">
          <div className="home-desktop-sidebar-card">
            <h4>🔥 热门排行</h4>
            {allGoods.slice(0, 5).map((good) => (
              <div
                key={good.id}
                className="home-desktop-sidebar-item"
                onClick={() => navigate(`/detail/${good.id}`)}
              >
                <img src={good.image} alt={good.name} />
                <div className="home-desktop-sidebar-item-info">
                  <div className="home-desktop-sidebar-item-name">
                    {good.name}
                  </div>
                  <div className="home-desktop-sidebar-item-price">
                    ¥{good.price}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
