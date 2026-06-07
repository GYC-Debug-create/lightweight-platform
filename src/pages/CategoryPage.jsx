import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { getCategories, getGoodsByCategory } from "../services/goodService";

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [goods, setGoods] = useState([]);

  useEffect(() => {
    const cats = getCategories();
    setCategories(cats);
    if (cats.length > 0) {
      setActiveCategoryId(cats[0].id);
    }
  }, []);

  useEffect(() => {
    if (activeCategoryId) {
      const categoryGoods = getGoodsByCategory(activeCategoryId);
      setGoods(categoryGoods);
    }
  }, [activeCategoryId]);

  return (
    <div className="category-page">
      <div className="category-sidebar">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className={`category-sidebar-item${
              activeCategoryId === cat.id ? " active" : ""
            }`}
            onClick={() => setActiveCategoryId(cat.id)}
          >
            {cat.name}
          </div>
        ))}
      </div>

      <div className="category-content">
        <div className="category-content-grid">
          {goods.length > 0 ? (
            goods.map((good) => (
              <ProductCard key={good.id} product={good} />
            ))
          ) : (
            <div className="goods-empty">该分类下暂无商品</div>
          )}
        </div>
      </div>
    </div>
  );
}
