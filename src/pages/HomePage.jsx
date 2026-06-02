import { useState, useEffect, useContext } from "react";
import { ServiceContext } from "../contexts/ServiceContext";
import ProductCard from "../components/ProductCard";
import EmptyState from "../components/EmptyState";

const banners = [
  { id: 1, text: "新品上市 · 无线蓝牙耳机", color: "#4A90D9" },
  { id: 2, text: "限时优惠 · 全场低至6折", color: "#E85D75" },
  { id: 3, text: "品质保证 · 7天无理由退换", color: "#50B86C" },
];

const HomePage = () => {
  const services = useContext(ServiceContext);
  const [keyword, setKeyword] = useState("");
  const [bannerIndex, setBannerIndex] = useState(0);
  const [searchResults, setSearchResults] = useState(null);

  const hotGoods = services.good.getHotGoods();

  useEffect(() => {
    const timer = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % banners.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = () => {
    const trimmed = keyword.trim();
    if (!trimmed) {
      setSearchResults(null);
      return;
    }
    const results = services.good.searchGoods(trimmed);
    setSearchResults(results);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleClearSearch = () => {
    setKeyword("");
    setSearchResults(null);
  };

  const displayGoods = searchResults !== null ? searchResults : hotGoods;

  return (
    <div className="home-page">
      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="搜索商品…"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="search-btn" onClick={handleSearch}>
          搜索
        </button>
        {searchResults !== null && (
          <button className="search-clear" onClick={handleClearSearch}>
            清除
          </button>
        )}
      </div>

      {searchResults === null && (
        <div className="banner">
          <div
            className="banner-slide"
            style={{ backgroundColor: banners[bannerIndex].color }}
          >
            <span>{banners[bannerIndex].text}</span>
          </div>
          <div className="banner-dots">
            {banners.map((b, i) => (
              <span
                key={b.id}
                className={`banner-dot ${i === bannerIndex ? "active" : ""}`}
                onClick={() => setBannerIndex(i)}
              />
            ))}
          </div>
        </div>
      )}

      <div className="section">
        <h3 className="section-title">
          {searchResults !== null ? "搜索结果" : "热门商品"}
        </h3>
        {displayGoods.length > 0 ? (
          <div className="product-grid">
            {displayGoods.map((g) => (
              <ProductCard key={g.id} product={g} />
            ))}
          </div>
        ) : (
          <EmptyState message="暂无商品" />
        )}
      </div>
    </div>
  );
};

export default HomePage;
