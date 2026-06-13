import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  getSessionStorage,
  removeSessionStorage,
} from "../utils/storage";
import { ServiceContext } from "../contexts/ServiceContext";
import { formatPrice } from "../utils/format";
import EmptyState from "../components/EmptyState";
import { Button, message } from "antd";
import { LeftOutlined } from "@ant-design/icons";

const PENDING_ITEMS_KEY = "pending_order_items";
const PENDING_SOURCE_KEY = "pending_order_source";

// 从 sessionStorage 读取待下单数据
function loadPendingData() {
  const pendingItems = getSessionStorage(PENDING_ITEMS_KEY, []);
  const pendingSource = getSessionStorage(PENDING_SOURCE_KEY, "");
  const hasItems = pendingItems && pendingItems.length > 0;
  return {
    items: hasItems ? pendingItems : [],
    source: hasItems ? pendingSource : "",
  };
}

// 获取默认收货信息
function getDefaultReceiverInfo(services) {
  const user = services.auth.getCurrentUser();
  return {
    receiver: user?.username || "测试用户",
    phone: "<手机号>",
    address: "北京市海淀区北京交通大学",
  };
}

const CreateOrderPage = () => {
  const navigate = useNavigate();
  const services = useContext(ServiceContext);

  // 校验登录状态
  useEffect(() => {
    if (!services.auth.isUserLoggedIn()) {
      navigate("/login", { replace: true });
    }
  }, [navigate, services.auth]);

  // 初始化订单商品数据
  const [{ items }] = useState(loadPendingData);
  const [receiverInfo, setReceiverInfo] = useState(() => getDefaultReceiverInfo(services));
  const [submitting, setSubmitting] = useState(false);

  // 计算总价
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.count,
    0
  );

  // 提交订单
  const handleSubmit = () => {
    if (submitting) return;
    const { receiver, phone, address } = receiverInfo;
    if (!receiver.trim() || !phone.trim() || !address.trim()) {
      message.warning("请填写完整的收货信息");
      return;
    }
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(phone.trim())) {
      message.warning("请输入正确的11位手机号");
      return;
    }
    if (items.length === 0) {
      message.warning("没有待下单商品");
      return;
    }

    setSubmitting(true);

    try {
      // 创建订单
      const order = services.order.createOrder(items, {
        receiver: receiver.trim(),
        phone: phone.trim(),
        address: address.trim(),
      });

      // 清理临时数据
      removeSessionStorage(PENDING_ITEMS_KEY);
      removeSessionStorage(PENDING_SOURCE_KEY);

      // 清理购物车中已下单的商品
      items.forEach((item) => {
        services.cart.removeCartItem(item.productId);
      });

      // 跳转到支付页
      navigate(`/pay/${order.id}`, { replace: true });
    } catch {
      message.error("订单创建失败，请重试");
      setSubmitting(false);
    }
  };

  // 空状态：没有待下单商品
  if (items.length === 0) {
    return (
      <div className="create-order-page">
        <h2 className="page-title">创建订单</h2>
        <EmptyState
          message="暂无待结算商品"
          actionText="返回首页"
          onAction={() => navigate("/", { replace: true })}
        />
      </div>
    );
  }

  return (
    <div className="create-order-page">
      <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #eee', padding: '12px 16px' }}>
        <Button 
          type="text" 
          icon={<LeftOutlined />} 
          onClick={() => navigate(-1)} 
          style={{ marginRight: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        />
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>创建订单</h2>
      </div>

      {/* 商品列表 */}
      <div className="order-section">
        <h3 className="section-title">商品信息</h3>
        {items.map((item, index) => (
          <div className="order-item" key={`${item.productId}-${index}`}>
            <img
              className="order-item-img"
              src={item.image}
              alt={item.name}
            />
            <div className="order-item-info">
              <p className="order-item-name">{item.name}</p>
              <p className="order-item-price">{formatPrice(item.price)}</p>
              <p className="order-item-count">x{item.count}</p>
            </div>
            <div className="order-item-subtotal">
              {formatPrice(item.price * item.count)}
            </div>
          </div>
        ))}
        <div className="order-total">
          <span>合计：</span>
          <span className="order-total-price">{formatPrice(totalPrice)}</span>
        </div>
      </div>

      {/* 收货信息 */}
      <div className="order-section">
        <h3 className="section-title">收货信息</h3>
        <div className="receiver-form">
          <div className="form-field">
            <label>收货人</label>
            <input
              type="text"
              value={receiverInfo.receiver}
              onChange={(e) =>
                setReceiverInfo((prev) => ({ ...prev, receiver: e.target.value }))
              }
              placeholder="请输入收货人姓名"
            />
          </div>
          <div className="form-field">
            <label>手机号</label>
            <input
              type="text"
              value={receiverInfo.phone}
              onChange={(e) =>
                setReceiverInfo((prev) => ({ ...prev, phone: e.target.value }))
              }
              placeholder="请输入手机号"
            />
          </div>
          <div className="form-field">
            <label>收货地址</label>
            <input
              type="text"
              value={receiverInfo.address}
              onChange={(e) =>
                setReceiverInfo((prev) => ({ ...prev, address: e.target.value }))
              }
              placeholder="请输入收货地址"
            />
          </div>
        </div>
      </div>

      {/* 提交按钮 */}
      <div className="order-actions">
        <button
          className="submit-order-btn"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? "提交中..." : "提交订单"}
        </button>
      </div>
    </div>
  );
};

export default CreateOrderPage;
