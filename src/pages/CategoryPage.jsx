import React, { useState, useEffect, useCallback } from "react";
import ProductCard from "../components/ProductCard";
import { getCategories, getGoodsByCategory, getGoods } from "../services/goodService";
import { useSearchParams } from "react-router-dom";

const CATEGORY_ICONS = {
  c001: "💻",
  c002: "👕",
  c003: "🍔",
  c004: "🏠",
};

export default function CategoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [goods, setGoods] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({});

  useEffect(() => {
    const cats = getCategories();
    setCategories(cats);

    const allGoods = getGoods();
    const counts = {};
    cats.forEach((cat) => {
      counts[cat.id] = allGoods.filter((g) => g.categoryId === cat.id).length;
    });
    counts.all = allGoods.length;
    setCategoryCounts(counts);
  }, []);

  const syncActiveFromURL = useCallback(() => {
    const catParam = searchParams.get("cat");
    if (catParam === "all") {
      setActiveCategoryId("all");
    } else if (catParam && categories.find((c) => c.id === catParam)) {
      setActiveCategoryId(catParam);
    } else {
      setActiveCategoryId("all");
    }
  }, [searchParams, categories]);

  useEffect(() => {
    syncActiveFromURL();
  }, [syncActiveFromURL]);

  useEffect(() => {
    if (activeCategoryId === "all") {
      setGoods(getGoods());
    } else if (activeCategoryId) {
      setGoods(getGoodsByCategory(activeCategoryId));
    }
  }, [activeCategoryId]);

  const handleCategoryClick = (catId) => {
    setActiveCategoryId(catId);
    if (catId === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ cat: catId });
    }
  };

  const activeCategory = activeCategoryId === "all"
    ? { id: "all", name: "全部" }
    : categories.find((c) => c.id === activeCategoryId);

  return (
    <div className="category-page">
      <div className="category-sidebar">
        <div
          className={`category-sidebar-item${
            activeCategoryId === "all" ? " active" : ""
          }`}
          onClick={() => handleCategoryClick("all")}
        >
          <span className="category-sidebar-icon">📦</span>
          <span className="category-sidebar-name">全部</span>
        </div>
        {categories.map((cat) => (
          <div
            key={cat.id}
            className={`category-sidebar-item${
              activeCategoryId === cat.id ? " active" : ""
            }`}
            onClick={() => handleCategoryClick(cat.id)}
          >
            <span className="category-sidebar-icon">
              {CATEGORY_ICONS[cat.id] || "📦"}
            </span>
            <span className="category-sidebar-name">{cat.name}</span>
          </div>
        ))}
      </div>

      <div className="category-content">
        {activeCategory && (
          <div className="category-content-header">
            <h2 className="category-content-title">{activeCategory.name}</h2>
            <span className="category-content-count">
              共 {goods.length} 件商品
            </span>
          </div>
        )}

        {goods.length > 0 ? (
          <div className="category-content-grid">
            {goods.map((good) => (
              <div key={good.id} className="category-grid-item">
                <ProductCard product={good} />
              </div>
            ))}
          </div>
        ) : (
          <div className="category-empty">
            <div className="category-empty-icon">📭</div>
            <p>该分类下暂无商品</p>
            <button
              className="category-empty-btn"
              onClick={() => handleCategoryClick("all")}
            >
              查看全部商品
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
