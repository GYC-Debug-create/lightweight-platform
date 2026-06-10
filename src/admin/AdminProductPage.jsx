import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Table, Space, Popconfirm, message, Modal, Form, Input, InputNumber, Switch, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, LogoutOutlined } from '@ant-design/icons';
import { isAdminLoggedIn, adminLogout } from '../services/authService';
import { getGoods, createGood, updateGood, deleteGood, getCategories } from '../services/goodService';

const AdminProductPage = () => {
  const navigate = useNavigate();
  const [goods, setGoods] = useState(() => getGoods());
  const [categories, setCategories] = useState(() => getCategories());
  const [modalVisible, setModalVisible] = useState(false);
  const [editingGood, setEditingGood] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(() => {
    setGoods(getGoods());
    setCategories(getCategories());
  }, []);

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  const showCreateModal = () => {
    setEditingGood(null);
    form.resetFields();
    form.setFieldsValue({
      categoryId: categories[0]?.id,
      hot: false,
      stock: 1,
      price: 0,
    });
    setModalVisible(true);
  };

  const showEditModal = (good) => {
    setEditingGood(good);
    form.setFieldsValue({
      name: good.name,
      categoryId: good.categoryId,
      price: good.price,
      image: good.image,
      description: good.description,
      stock: good.stock,
      hot: good.hot,
    });
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      if (editingGood) {
        // 更新商品
        const updated = { ...editingGood, ...values };
        updateGood(editingGood.id, updated);
        message.success('商品更新成功');
      } else {
        // 新增商品：生成简单 ID
        const newId = `g${Date.now()}`;
        const newGood = { id: newId, ...values };
        createGood(newGood);
        message.success('商品添加成功');
      }
      setModalVisible(false);
      loadData(); // 刷新列表
    } catch (error) {
      console.error('表单验证失败', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    deleteGood(id);
    message.success('删除成功');
    loadData();
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 100 },
    { title: '名称', dataIndex: 'name', key: 'name' },
    {
      title: '分类',
      dataIndex: 'categoryId',
      key: 'categoryId',
      render: (catId) => categories.find(c => c.id === catId)?.name || catId,
    },
    { title: '价格', dataIndex: 'price', key: 'price', render: (price) => `¥${price}` },
    { title: '库存', dataIndex: 'stock', key: 'stock' },
    { title: '热门', dataIndex: 'hot', key: 'hot', render: (hot) => (hot ? '是' : '否') },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button icon={<EditOutlined />} size="small" onClick={() => showEditModal(record)}>编辑</Button>
          <Popconfirm title="确定删除该商品吗？" onConfirm={() => handleDelete(record.id)} okText="确定" cancelText="取消">
            <Button icon={<DeleteOutlined />} size="small" danger>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (!isAdminLoggedIn()) return null;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2>后台商品管理</h2>
        <Button icon={<LogoutOutlined />} onClick={handleLogout}>退出后台</Button>
      </div>
      <Button type="primary" icon={<PlusOutlined />} onClick={showCreateModal} style={{ marginBottom: 16 }}>
        新增商品
      </Button>
      <Table
        dataSource={goods}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingGood ? '编辑商品' : '新增商品'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        confirmLoading={loading}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="商品名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="categoryId" label="分类" rules={[{ required: true }]}>
            <Select>
              {categories.map(cat => (
                <Select.Option key={cat.id} value={cat.id}>{cat.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="price" label="价格" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="image" label="图片URL">
            <Input placeholder="/goods/example.svg" />
          </Form.Item>
          <Form.Item name="description" label="商品描述">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="stock" label="库存" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="hot" label="热门商品" valuePropName="checked">
            <Switch checkedChildren="是" unCheckedChildren="否" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminProductPage;