import { useState, useContext } from "react";
import { ServiceContext } from "../contexts/ServiceContext";
import ProductCard from "../components/ProductCard";
import EmptyState from "../components/EmptyState";

const CategoryPage = () => {
  const services = useContext(ServiceContext);
  const categories = services.good.getCategories();
  const [activeId, setActiveId] = useState(
    categories.length > 0 ? categories[0].id : null
  );

  const goods = activeId ? services.good.getGoodsByCategory(activeId) : [];

  return (
    <div className="category-page">
      <div className="category-sidebar">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className={`category-item ${cat.id === activeId ? "active" : ""}`}
            onClick={() => setActiveId(cat.id)}
          >
            {cat.name}
          </div>
        ))}
      </div>

      <div className="category-content">
        {goods.length > 0 ? (
          <div className="product-grid">
            {goods.map((g) => (
              <ProductCard key={g.id} product={g} />
            ))}
          </div>
        ) : (
          <EmptyState message="该分类暂无商品" />
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
