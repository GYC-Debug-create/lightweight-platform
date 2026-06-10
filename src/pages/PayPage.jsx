import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ServiceContext } from "../contexts/ServiceContext";
import { formatPrice, formatDate } from "../utils/format";
import EmptyState from "../components/EmptyState";
import { Button, message } from "antd";
import { LeftOutlined } from "@ant-design/icons";

const PayPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const services = useContext(ServiceContext);

  // 登录检查（真正的副作用）
  useEffect(() => {
    if (!services.auth.isUserLoggedIn()) {
      navigate("/login", { replace: true });
    }
  }, [navigate, services.auth]);

  // 同步读取订单数据到初始状态
  const [order, setOrder] = useState(() => {
    if (!orderId) return null;
    return services.order.getOrderById(orderId);
  });

  const [paying, setPaying] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const isPaid = order ? order.status !== "待支付" : false;

  // 倒计时自动跳转副作用
  useEffect(() => {
    if (!isPaid) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate(`/order/${orderId}`, { replace: true });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaid, navigate, orderId]);

  // 确认支付
  const handlePay = () => {
    if (paying) return;
    setPaying(true);

    const success = services.order.payOrder(orderId);
    if (success) {
      // 重新加载订单以更新状态
      const updated = services.order.getOrderById(orderId);
      setOrder(updated);
    } else {
      message.error("支付失败，请重试");
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

  return (
    <div className="pay-page">
      <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #eee', padding: '12px 16px' }}>
        <Button 
          type="text" 
          icon={<LeftOutlined />} 
          onClick={() => navigate('/orders', { replace: true })} 
          style={{ marginRight: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        />
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>订单支付</h2>
      </div>

      <div className="pay-card">
        <p className="pay-order-id">
          订单编号：{order.id}
        </p>
        <div className="pay-amount">
          <span className="pay-amount-label">支付金额</span>
          <span className="pay-amount-value">{formatPrice(order.totalPrice)}</span>
        </div>

        {isPaid ? (
          <div className="pay-result paid" style={{ textAlign: "center" }}>
            <p style={{ fontSize: "18px", fontWeight: "bold", color: "#52c41a", margin: "10px 0" }}>✅ 支付成功</p>
            <p className="pay-redirect-tip" style={{ color: "#86868b", fontSize: "14px", marginBottom: "16px" }}>
              系统将在 {countdown} 秒后自动跳转至订单详情...
            </p>
            {order.payTime && (
              <p className="pay-time" style={{ color: "#86868b", fontSize: "13px", marginBottom: "20px" }}>
                支付时间：{formatDate(order.payTime)}
              </p>
            )}
            <button
              className="view-order-btn"
              onClick={() => navigate(`/order/${orderId}`, { replace: true })}
              style={{ width: "100%", height: "40px", borderRadius: "8px", background: "#0071e3", color: "#fff", border: "none", cursor: "pointer", fontWeight: "500" }}
            >
              立即跳转 ({countdown}s)
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
