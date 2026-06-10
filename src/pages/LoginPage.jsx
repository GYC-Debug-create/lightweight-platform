import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Input, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { ServiceContext } from '../contexts/ServiceContext';

const LoginPage = () => {
  const services = useContext(ServiceContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    // 模拟异步
    setTimeout(() => {
      if (isRegister) {
        const user = services.auth.register(values.username, values.password);
        if (user) {
          message.success('注册并登录成功');
          navigate('/mine');
        } else {
          message.error('注册失败：用户名已存在');
        }
      } else {
        const user = services.auth.login(values.username, values.password);
        if (user) {
          message.success('登录成功');
          navigate('/mine');
        } else {
          message.error('用户名或密码错误');
        }
      }
      setLoading(false);
    }, 100);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '360px', margin: '0 auto' }}>
      <h2>{isRegister ? '用户注册' : '用户登录'}</h2>
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
            {isRegister ? '注册' : '登录'}
          </Button>
        </Form.Item>
      </Form>
      <div style={{ textAlign: 'center', marginTop: 12 }}>
        <a onClick={() => setIsRegister(!isRegister)} style={{ fontSize: '13px', color: 'var(--color-primary)' }}>
          {isRegister ? '已有账号？去登录' : '没有账号？立即注册'}
        </a>
      </div>
      {!isRegister && (
        <div style={{ marginTop: 16, color: '#999', fontSize: 12 }}>
          测试账号：member / 123456
        </div>
      )}
    </div>
  );
};

export default LoginPage;