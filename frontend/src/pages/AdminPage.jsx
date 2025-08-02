import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Typography,
  Table,
  Button,
  Switch,
  InputNumber,
  Space,
  Modal,
  Form,
  Input,
  message,
  Spin,
  Card,
  Row,
  Col,
} from 'antd';
import { PlusOutlined, EditOutlined, ShoppingOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { 
  getProducts, 
  updateProductStockAsync, 
  toggleProductStatusAsync, 
  addProductAsync,
  updateProductAsync
} from '../store/productsSlice';

const { Title } = Typography;

const AdminPage = () => {
  const dispatch = useDispatch();
  const { items: products, status, error } = useSelector((state) => state.products);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingProduct, setEditingProduct] = useState(null);
  
  // 组件挂载时获取商品数据
  useEffect(() => {
    if (status === 'idle') {
      dispatch(getProducts());
    }
  }, [dispatch, status]);

  const handleStockChange = (id, newStock) => {
    dispatch(updateProductStockAsync({ id, newStock }))
      .unwrap()
      .then(() => {
        message.success('库存已更新');
      })
      .catch((error) => {
        message.error(`更新库存失败: ${error}`);
      });
  };

  const handleStatusToggle = (id) => {
    dispatch(toggleProductStatusAsync(id))
      .unwrap()
      .then(() => {
        message.success('商品状态已更新');
      })
      .catch((error) => {
        message.error(`更新商品状态失败: ${error}`);
      });
  };

  const showAddModal = () => {
    setEditingProduct(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (product) => {
    setEditingProduct(product);
    form.setFieldsValue({
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.image,
      stock: product.stock,
    });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = (values) => {
    if (editingProduct) {
      // 编辑现有商品
      dispatch(updateProductAsync({
        id: editingProduct.id,
        productData: {
          name: values.name,
          price: parseFloat(values.price),
          description: values.description,
          image: values.image,
          stock: values.stock,
        }
      }))
        .unwrap()
        .then(() => {
          message.success('商品已更新');
          setIsModalVisible(false);
        })
        .catch((error) => {
          message.error(`更新商品失败: ${error}`);
        });
    } else {
      // 添加新商品
      dispatch(addProductAsync({
        name: values.name,
        price: parseFloat(values.price),
        description: values.description,
        image: values.image || 'https://via.placeholder.com/200',
        stock: values.stock,
        isActive: true,
      }))
        .unwrap()
        .then(() => {
          message.success('商品已添加');
          setIsModalVisible(false);
        })
        .catch((error) => {
          message.error(`添加商品失败: ${error}`);
        });
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '商品名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '图片',
      dataIndex: 'image',
      key: 'image',
      render: (image, record) => (
        <img src={image} alt={record.name} style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
      ),
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `¥${price.toFixed(2)}`,
    },
    {
      title: '库存',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock, record) => (
        <InputNumber
          min={0}
          value={stock}
          onChange={(value) => handleStockChange(record.id, value)}
        />
      ),
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive, record) => (
        <Switch
          checked={isActive}
          onChange={() => handleStatusToggle(record.id)}
          checkedChildren="上架"
          unCheckedChildren="下架"
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button
          icon={<EditOutlined />}
          onClick={() => showEditModal(record)}
        >
          编辑
        </Button>
      ),
    },
  ];

  return (
    <div className="container">
      <Title level={2}>管理后台</Title>
      
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col span={12}>
          <Card hoverable>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <ShoppingOutlined style={{ fontSize: '24px', marginRight: '12px' }} />
              <div>
                <Typography.Title level={4} style={{ margin: 0 }}>商品管理</Typography.Title>
                <Typography.Text type="secondary">管理商品信息、库存和状态</Typography.Text>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Link to="/orders-management">
            <Card hoverable>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <ShoppingCartOutlined style={{ fontSize: '24px', marginRight: '12px' }} />
                <div>
                  <Typography.Title level={4} style={{ margin: 0 }}>订单管理</Typography.Title>
                  <Typography.Text type="secondary">查看和处理客户订单</Typography.Text>
                </div>
              </div>
            </Card>
          </Link>
        </Col>
      </Row>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Title level={3}>商品管理</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={showAddModal}
        >
          添加商品
        </Button>
      </div>

      {status === 'loading' ? (
        <div style={{ textAlign: 'center', margin: '40px 0' }}>
          <Spin size="large" tip="加载商品中..." />
        </div>
      ) : status === 'failed' ? (
        <div style={{ textAlign: 'center', margin: '40px 0' }}>
          <Typography.Paragraph>加载商品失败: {error}</Typography.Paragraph>
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={products}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      )}

      <Modal
        title={editingProduct ? '编辑商品' : '添加商品'}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="商品名称"
            rules={[{ required: true, message: '请输入商品名称' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="price"
            label="价格"
            rules={[
              { required: true, message: '请输入价格' },
              { type: 'number', min: 0, message: '价格必须大于等于0', transform: (value) => parseFloat(value) },
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              step={0.01}
              precision={2}
              formatter={(value) => `¥ ${value}`}
              parser={(value) => value.replace(/¥\s?/g, '')}
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="商品描述"
            rules={[{ required: true, message: '请输入商品描述' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="image"
            label="图片URL"
            rules={[{ required: true, message: '请输入图片URL' }]}
          >
            <Input placeholder="https://via.placeholder.com/200" />
          </Form.Item>

          <Form.Item
            name="stock"
            label="库存"
            rules={[{ required: true, message: '请输入库存数量' }]}
          >
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={handleCancel}>取消</Button>
              <Button type="primary" htmlType="submit">
                {editingProduct ? '更新' : '添加'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminPage;