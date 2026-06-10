import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ServiceContext } from "../contexts/ServiceContext";
import {
  Button,
  InputNumber,
  Checkbox,
  message,
  Popconfirm,
} from "antd";
import {
  DeleteOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";

const CartPage = () => {
  const services = useContext(ServiceContext);
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(() => services.cart.getCart());

  const loadCart = () => setCartItems(services.cart.getCart());

  const checkedItems = cartItems.filter((i) => i.checked);
  const totalPrice = checkedItems.reduce(
    (sum, i) => sum + i.price * i.count,
    0,
  );
  const allChecked = cartItems.length > 0 && cartItems.every((i) => i.checked);

  const handleCheck = (productId, checked) => {
    services.cart.toggleCartItem(productId, checked);
    loadCart();
  };

  const handleCheckAll = (e) => {
    services.cart.toggleAllCartItems(e.target.checked);
    loadCart();
  };

  const handleCountChange = (productId, count) => {
    if (count === null) return;
    services.cart.updateCartItem(productId, count);
    loadCart();
  };

  const handleDelete = (productId) => {
    services.cart.removeCartItem(productId);
    message.success("已删除");
    loadCart();
  };

  const handleCheckout = () => {
    if (checkedItems.length === 0) {
      message.warning("请勾选要购买的商品");
      return;
    }
    if (!services.auth.isUserLoggedIn()) {
      message.warning("请先登录再进行结算");
      navigate("/login");
      return;
    }
    sessionStorage.setItem("pending_order_items", JSON.stringify(checkedItems));
    sessionStorage.setItem("pending_order_source", "cart");
    navigate("/order/create");
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-page-header">
          <h2>购物车</h2>
        </div>
        <div className="cart-empty">
          <div className="cart-empty-icon">
            <ShoppingCartOutlined />
          </div>
          <p>购物车还是空的</p>
          <Button
            type="primary"
            icon={<ShoppingOutlined />}
            onClick={() => navigate("/")}
          >
            去逛逛
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-page-header">
        <h2>购物车</h2>
      </div>

      <div className="cart-list">
        {cartItems.map((item) => (
          <div key={item.productId} className="cart-item">
            <Checkbox
              checked={item.checked}
              onChange={(e) => handleCheck(item.productId, e.target.checked)}
            />

            <img src={item.image} alt={item.name} className="cart-item-image" />

            <div className="cart-item-body">
              <div className="cart-item-name">{item.name}</div>
              <div className="cart-item-price">¥{item.price}</div>
              <div className="cart-item-controls">
                <InputNumber
                  size="small"
                  min={1}
                  max={item.stock || 9999}
                  value={item.count}
                  onChange={(v) => handleCountChange(item.productId, v)}
                  style={{ width: 90 }}
                />
                <Popconfirm
                  title="确定要删除该商品吗？"
                  onConfirm={() => handleDelete(item.productId)}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button
                    type="text"
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                  />
                </Popconfirm>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-bottom-bar">
        <div className="cart-bottom-left">
          <Checkbox checked={allChecked} onChange={handleCheckAll}>
            全选
          </Checkbox>
        </div>
        <div className="cart-bottom-right">
          <div className="cart-total">
            <span className="cart-total-label">合计&nbsp;</span>
            <span className="cart-total-price">¥{totalPrice.toFixed(2)}</span>
          </div>
          <Button
            type="primary"
            size="large"
            disabled={checkedItems.length === 0}
            onClick={handleCheckout}
            className="cart-checkout-btn"
          >
            结算({checkedItems.length})
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
