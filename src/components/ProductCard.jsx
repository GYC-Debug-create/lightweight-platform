import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  if (!product) return null;

  return (
    <Link to={`/detail/${product.id}`} className="product-card">
      <img src={product.image} alt={product.name} />
      <div className="product-card-info">
        <h4>{product.name}</h4>
        <p>¥{product.price}</p>
      </div>
    </Link>
  );
};

export default ProductCard;
