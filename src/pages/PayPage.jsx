import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { isUserLoggedIn } from "../services/authService";
import { getOrderById, payOrder } from "../services/orderService";
import { formatPrice, formatDate } from "../utils/format";
import EmptyState from "../components/EmptyState";

const PayPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  // 登录检查（真正的副作用）
  useEffect(() => {
    if (!isUserLoggedIn()) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // 同步读取订单数据到初始状态
  const [order, setOrder] = useState(() => {
    if (!orderId) return null;
    return getOrderById(orderId);
  });

  const [paying, setPaying] = useState(false);

  // 确认支付
  const handlePay = () => {
    if (paying) return;
    setPaying(true);

    const success = payOrder(orderId);
    if (success) {
      // 重新加载订单以更新状态
      const updated = getOrderById(orderId);
      setOrder(updated);
      // 跳转到订单详情
      setTimeout(() => {
        navigate(`/order/${orderId}`, { replace: true });
      }, 800);
    } else {
      alert("支付失败，请重试");
      setPaying(false);
    }
  };

  // 订单不存在
  if (!order) {
    return (
      <div className="pay-page">
        <h2 className="page-title">支付</h2>
        <EmptyState
          message="订单不存在"
          actionText="返回首页"
          onAction={() => navigate("/", { replace: true })}
        />
      </div>
    );
  }

  const isPaid = order.status !== "待支付";

  return (
    <div className="pay-page">
      <h2 className="page-title">订单支付</h2>

      <div className="pay-card">
        <p className="pay-order-id">
          订单编号：{order.id}
        </p>
        <div className="pay-amount">
          <span className="pay-amount-label">支付金额</span>
          <span className="pay-amount-value">{formatPrice(order.totalPrice)}</span>
        </div>

        {isPaid ? (
          <div className="pay-result paid">
            <p>✅ 已支付</p>
            {order.payTime && (
              <p className="pay-time">支付时间：{formatDate(order.payTime)}</p>
            )}
            <button
              className="view-order-btn"
              onClick={() => navigate(`/order/${orderId}`, { replace: true })}
            >
              查看订单详情
            </button>
          </div>
        ) : (
          <div className="pay-actions">
            <button
              className="pay-btn"
              onClick={handlePay}
              disabled={paying}
            >
              {paying ? "支付中..." : `确认支付 ${formatPrice(order.totalPrice)}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PayPage;
