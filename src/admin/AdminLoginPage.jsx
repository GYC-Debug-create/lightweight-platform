import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Input, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { adminLogin } from '../services/authService';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
    setTimeout(() => {
      const admin = adminLogin(values.username, values.password);
      if (admin) {
        message.success('后台登录成功');
        navigate('/admin/products');
      } else {
        message.error('管理员用户名或密码错误（admin / 123456）');
      }
      setLoading(false);
    }, 100);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '360px', margin: '0 auto' }}>
      <h2>后台登录</h2>
      <Form onFinish={onFinish} autoComplete="off">
        <Form.Item
          name="username"
          rules={[{ required: true, message: '请输入管理员用户名' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="用户名" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: '请输入密码' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="密码" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            登录
          </Button>
        </Form.Item>
      </Form>
      <div style={{ marginTop: 16, color: '#999', fontSize: 12 }}>
        测试账号：admin / 123456
      </div>
    </div>
  );
};

export default AdminLoginPage;