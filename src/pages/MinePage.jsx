import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Space, message } from 'antd';
import { UserOutlined, ShoppingOutlined, LogoutOutlined } from '@ant-design/icons';
import { getCurrentUser, logout } from '../services/authService';

const MinePage = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    message.success('已退出登录');
    navigate('/');
  };

  if (!user) return null;

  return (
    <div style={{ padding: '20px' }}>
      <Card
        title="个人信息"
        variant="borderless"
        style={{ marginBottom: 20 }}
      >
        <p><UserOutlined /> 用户名：{user.username}</p>
        <p>角色：{user.role}</p>
      </Card>

      <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
        <Button
          type="primary"
          icon={<ShoppingOutlined />}
          block
          onClick={() => navigate('/orders')}
        >
          我的订单
        </Button>
        <Button
          danger
          icon={<LogoutOutlined />}
          block
          onClick={handleLogout}
        >
          退出登录
        </Button>
      </Space>
    </div>
  );
};

export default MinePage;