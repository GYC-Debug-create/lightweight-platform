import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Input, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { login } from '../services/authService';

const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    // 模拟异步（实际 login 是同步的）
    setTimeout(() => {
      const user = login(values.username, values.password);
      if (user) {
        message.success('登录成功');
        navigate('/mine');
      } else {
        message.error('用户名或密码错误（固定账号 member / 123456）');
      }
      setLoading(false);
    }, 100);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '360px', margin: '0 auto' }}>
      <h2>用户登录</h2>
      <Form onFinish={onFinish} autoComplete="off">
        <Form.Item
          name="username"
          rules={[{ required: true, message: '请输入用户名' }]}
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
        测试账号：member / 123456
      </div>
    </div>
  );
};

export default LoginPage;