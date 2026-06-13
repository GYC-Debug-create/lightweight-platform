import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ServiceContext } from "../contexts/ServiceContext";
import { formatPrice, formatDate } from "../utils/format";
import EmptyState from "../components/EmptyState";

// 状态展示映射
const STATUS_MAP = {
  "待支付": { label: "待支付", className: "status-pending" },
  "已支付": { label: "已支付", className: "status-paid" },
  "已发货": { label: "已发货", className: "status-shipped" },
  "已完成": { label: "已完成", className: "status-done" },
  "已取消": { label: "已取消", className: "status-canceled" },
};

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const services = useContext(ServiceContext);

  // 登录状态校验
  useEffect(() => {
    if (!services.auth.isUserLoggedIn()) {
      navigate("/login", { replace: true });
    }
  }, [navigate, services.auth]);

  // 获取订单数据
  const [order] = useState(() => {
    if (!orderId) return null;
    return services.order.getOrderById(orderId);
  });

  if (!order) {
    return (
      <div className="order-detail-page">
        <h2 className="page-title">订单详情</h2>
        <EmptyState
          message="订单不存在"
          actionText="返回订单列表"
          onAction={() => navigate("/orders", { replace: true })}
        />
      </div>
    );
  }

  const statusInfo = STATUS_MAP[order.status] || {
    label: order.status,
    className: "status-pending",
  };

  return (
    <div className="order-detail-page">
      <h2 className="page-title">订单详情</h2>

      {/* 订单状态 */}
      <div className="detail-section">
        <div className="detail-status-bar">
          <span className={`status-badge ${statusInfo.className}`}>
            {statusInfo.label}
          </span>
        </div>
        <p className="detail-order-id">
          <span className="detail-label">订单编号</span>
          <span>{order.id}</span>
        </p>
      </div>

      {/* 商品列表 */}
      <div className="detail-section">
        <h3 className="section-title">商品信息</h3>
        {order.items.map((item, index) => (
          <div className="detail-item" key={`${item.productId}-${index}`}>
            <img
              className="detail-item-img"
              src={item.image}
              alt={item.name}
            />
            <div className="detail-item-info">
              <p className="detail-item-name">{item.name}</p>
              <p className="detail-item-price">
                {formatPrice(item.price)} x{item.count}
              </p>
            </div>
            <div className="detail-item-subtotal">
              {formatPrice(item.price * item.count)}
            </div>
          </div>
        ))}
        <div className="detail-total">
          <span>合计：</span>
          <span className="detail-total-price">
            {formatPrice(order.totalPrice)}
          </span>
        </div>
      </div>

      {/* 收货信息 */}
      <div className="detail-section">
        <h3 className="section-title">收货信息</h3>
        <div className="detail-info-grid">
          <div className="info-row">
            <span className="detail-label">收货人</span>
            <span>{order.receiver}</span>
          </div>
          <div className="info-row">
            <span className="detail-label">手机号</span>
            <span>{order.phone}</span>
          </div>
          <div className="info-row">
            <span className="detail-label">收货地址</span>
            <span className="info-address">{order.address}</span>
          </div>
        </div>
      </div>

      {/* 时间信息 */}
      <div className="detail-section">
        <h3 className="section-title">时间信息</h3>
        <div className="detail-info-grid">
          <div className="info-row">
            <span className="detail-label">创建时间</span>
            <span>{formatDate(order.createTime)}</span>
          </div>
          {order.payTime && (
            <div className="info-row">
              <span className="detail-label">支付时间</span>
              <span>{formatDate(order.payTime)}</span>
            </div>
          )}
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="detail-actions">
        <button
          className="back-btn"
          onClick={() => navigate("/orders", { replace: true })}
        >
          返回订单列表
        </button>
        {order.status === "待支付" && (
          <button
            className="goto-pay-btn"
            onClick={() => navigate(`/pay/${order.id}`, { replace: true })}
          >
            去支付
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderDetailPage;
