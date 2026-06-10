import { useState, useEffect, useContext } from "react";
import ProductCard from "../components/ProductCard";
import { ServiceContext } from "../contexts/ServiceContext";
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
  "c004": "📦",
};

export default function HomePage() {
  const services = useContext(ServiceContext);
  const location = useLocation();
  const navigate = useNavigate();

  // 直接从 location.state 提取初始搜索词和商品数据，防止同步 effect 的 setState 触发
  const [keyword, setKeyword] = useState(() => {
    return location.state?.searchKeyword?.trim() || "";
  });
  
  const [goods, setGoods] = useState(() => {
    const searchKeyword = location.state?.searchKeyword?.trim();
    if (searchKeyword) {
      return services.good.searchGoods(searchKeyword);
    }
    return services.good.getHotGoods();
  });

  const [categories] = useState(() => services.good.getCategories());
  const [carouselIdx, setCarouselIdx] = useState(0);

  // 仅作为副作用清理历史 state 痕迹，不引发重新渲染
  useEffect(() => {
    if (location.state?.searchKeyword) {
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // 轮播图计时器
  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIdx((prev) => (prev + 1) % CAROUSEL_ITEMS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = () => {
    const trimmed = keyword.trim();
    if (!trimmed) {
      setGoods(services.good.getHotGoods());
      return;
    }
    const results = services.good.searchGoods(trimmed);
    setGoods(results);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  // 热排数据
  const hotRankingGoods = services.good.getHotGoods().slice(0, 5);

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
            {hotRankingGoods.map((good) => (
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
