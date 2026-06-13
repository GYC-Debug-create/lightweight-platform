import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Tag, Empty } from 'antd';
import { ServiceContext } from '../contexts/ServiceContext';
import { formatPrice, formatDate } from '../utils/format';

const OrderListPage = () => {
  const services = useContext(ServiceContext);
  const navigate = useNavigate();
  const user = services.auth.getCurrentUser();

  // 未登录跳转
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  // 获取排序后的订单列表
  const orders = services.order.getOrders()
    .sort((a, b) => new Date(b.createTime) - new Date(a.createTime));

  const getStatusColor = (status) => {
    switch (status) {
      case '待支付': return 'gold';
      case '已支付': return 'blue';
      case '已发货': return 'cyan';
      case '已完成': return 'green';
      case '已取消': return 'red';
      default: return 'default';
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>我的订单</h2>
      {orders.length === 0 ? (
        <Empty description="暂无订单，去逛逛吧" />
      ) : (
          <div className="order-list-container">
            {orders.map((order) => (
              <div key={order.id} style={{ marginBottom: 16 }}>
                <Card
                  hoverable
                  style={{ width: '100%', cursor: 'pointer' }}
                  onClick={() => navigate(`/order/${order.id}`)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span>订单号：{order.id}</span>
                    <Tag color={getStatusColor(order.status)}>{order.status}</Tag>
                  </div>
                  <div>总金额：{formatPrice(order.totalPrice)}</div>
                  <div>创建时间：{formatDate(order.createTime)}</div>
                  <div>商品数量：{order.items.reduce((sum, item) => sum + item.count, 0)} 件</div>
                </Card>
              </div>
            ))}
          </div>
      )}
    </div>
  );
};

export default OrderListPage;