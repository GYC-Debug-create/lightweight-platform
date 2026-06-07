import { useContext, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ServiceContext } from "../contexts/ServiceContext";
import { Button, InputNumber, message } from "antd";
import { ShoppingCartOutlined, ThunderboltOutlined } from "@ant-design/icons";

const DetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const services = useContext(ServiceContext);
  const [quantity, setQuantity] = useState(1);

  const good = services.good.getGoodById(id);

  if (!good) {
    return (
      <div className="detail-page-empty">
        <h2>商品不存在</h2>
        <p>该商品可能已下架或链接无效</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    services.cart.addToCart(good, quantity);
    message.success("已加入购物车");
  };

  const handleBuyNow = () => {
    services.cart.addToCart(good, quantity);
    navigate("/order/create");
  };

  return (
    <div className="detail-page">
      {good.image && (
        <div className="detail-image-wrap">
          <img src={good.image} alt={good.name} className="detail-image" />
        </div>
      )}

      <div className="detail-body">
        <h1 className="detail-name">{good.name}</h1>
        <div className="detail-price-row">
          <span className="detail-price">¥{good.price}</span>
          <span className="detail-stock">库存 {good.stock} 件</span>
        </div>
        <div className="detail-desc">{good.description}</div>
        <div className="detail-divider" />
        <div className="detail-quantity-row">
          <span>数量</span>
          <InputNumber
            min={1}
            max={good.stock}
            value={quantity}
            onChange={(v) => setQuantity(v || 1)}
          />
        </div>
      </div>

      <div className="detail-actions">
        <Button
          size="large"
          icon={<ShoppingCartOutlined />}
          onClick={handleAddToCart}
          className="detail-btn-cart"
        >
          加入购物车
        </Button>
        <Button
          type="primary"
          size="large"
          icon={<ThunderboltOutlined />}
          onClick={handleBuyNow}
          className="detail-btn-buy"
        >
          立即购买
        </Button>
      </div>
    </div>
  );
};

export default DetailPage;
