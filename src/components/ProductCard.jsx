import { Link } from "react-router-dom";
import { formatPrice } from "../utils/format";

const ProductCard = ({ product }) => {
  if (!product) return null;

  return (
    <Link to={`/detail/${product.id}`} className="product-card">
      <div className="product-card-img">
        <img src={product.image} alt={product.name} />
        {product.hot && <span className="product-card-badge">热卖</span>}
      </div>
      <div className="product-card-info">
        <h4 className="product-card-name">{product.name}</h4>
        <p className="product-card-price">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
};

export default ProductCard;
