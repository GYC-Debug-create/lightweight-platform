import { useContext, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { ServiceContext } from "../contexts/ServiceContext";
import ProductCard from "../components/ProductCard";

const CATEGORY_ICONS = {
  c001: "💻",
  c002: "👕",
  c003: "🍔",
  c004: "🏠",
};

export default function CategoryPage() {
  const services = useContext(ServiceContext);
  const [searchParams, setSearchParams] = useSearchParams();

  // 加载分类列表
  const [categories] = useState(() => services.good.getCategories());

  // 获取当前激活的分类 ID
  const activeCategoryId = useMemo(() => {
    const catParam = searchParams.get("cat");
    if (catParam === "all" || !catParam) {
      return "all";
    }
    return categories.some((c) => c.id === catParam) ? catParam : "all";
  }, [searchParams, categories]);

  // 获取当前分类下的商品
  const goods = useMemo(() => {
    if (activeCategoryId === "all") {
      return services.good.getGoods();
    }
    return services.good.getGoodsByCategory(activeCategoryId);
  }, [activeCategoryId, services.good]);

  const handleCategoryClick = (catId) => {
    if (catId === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ cat: catId });
    }
  };

  // 获取当前分类对象
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
