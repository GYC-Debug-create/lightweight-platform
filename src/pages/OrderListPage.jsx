import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { List, Card, Tag, Empty, Spin } from 'antd';
import { getCurrentUser } from '../services/authService';
import { getOrders } from '../services/orderService';
import { formatPrice, formatDate } from '../utils/format';

const OrderListPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = getCurrentUser();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    // 获取所有订单，按时间倒序
    const allOrders = getOrders();
    allOrders.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
    setOrders(allOrders);
    setLoading(false);
  }, [user, navigate]);

  if (!user) return null;

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

  if (loading) return <Spin tip="加载中..." style={{ display: 'block', marginTop: 100 }} />;

  return (
    <div style={{ padding: '20px' }}>
      <h2>我的订单</h2>
      {orders.length === 0 ? (
        <Empty description="暂无订单，去逛逛吧" />
      ) : (
        <List
          dataSource={orders}
          renderItem={(order) => (
            <List.Item>
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
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default OrderListPage;