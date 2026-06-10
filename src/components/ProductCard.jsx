import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/detail/${product.id}`);
  };

  return (
    <div className="product-card" onClick={handleClick}>
      <img
        src={product.image}
        alt={product.name}
        className="product-card-image"
      />
      <div className="product-card-body">
        <h3 className="product-name">{product.name}</h3>
        <span className="product-price">¥{product.price}</span>
      </div>
    </div>
  );
}
