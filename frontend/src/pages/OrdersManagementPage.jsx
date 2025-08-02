import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, message, Modal, Select, Typography, Space, Card, Spin } from 'antd';
import { EyeOutlined, EditOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;
const { Option } = Select;

const OrdersManagementPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [statusUpdateVisible, setStatusUpdateVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // 获取所有订单
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3001/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data);
    } catch (error) {
      console.error('获取订单失败:', error);
      message.error('获取订单失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 查看订单详情
  const showOrderDetails = (order) => {
    setSelectedOrder(order);
    setDetailsVisible(true);
  };

  // 显示更新状态对话框
  const showStatusUpdateModal = (order) => {
    setSelectedOrder(order);
    setSelectedStatus(order.status);
    setStatusUpdateVisible(true);
  };

  // 更新订单状态
  const updateOrderStatus = async () => {
    try {
      setUpdatingStatus(true);
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:3001/orders/${selectedOrder.id}/status`,
        { status: selectedStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success('订单状态更新成功');
      setStatusUpdateVisible(false);
      fetchOrders(); // 刷新订单列表
    } catch (error) {
      console.error('更新订单状态失败:', error);
      message.error('更新订单状态失败');
    } finally {
      setUpdatingStatus(false);
    }
  };

  // 获取状态标签颜色
  const getStatusColor = (status) => {
    const statusColors = {
      pending: 'gold',
      processing: 'blue',
      shipped: 'cyan',
      delivered: 'green',
      cancelled: 'red',
    };
    return statusColors[status] || 'default';
  };

  // 获取状态中文名称
  const getStatusText = (status) => {
    const statusTexts = {
      pending: '待处理',
      processing: '处理中',
      shipped: '已发货',
      delivered: '已送达',
      cancelled: '已取消',
    };
    return statusTexts[status] || status;
  };

  // 表格列定义
  const columns = [
    {
      title: '订单ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '用户',
      dataIndex: ['user', 'username'],
      key: 'username',
      width: 120,
    },
    {
      title: '总金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount) => `¥${amount.toFixed(2)}`,
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
      width: 100,
    },
    {
      title: '支付状态',
      dataIndex: 'isPaid',
      key: 'isPaid',
      render: (isPaid) => (
        <Tag color={isPaid ? 'green' : 'volcano'}>
          {isPaid ? '已支付' : '未支付'}
        </Tag>
      ),
      width: 100,
    },
    {
      title: '收货地址',
      dataIndex: 'shippingAddress',
      key: 'shippingAddress',
      ellipsis: true,
      width: 200,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleString(),
      width: 160,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => showOrderDetails(record)}
            size="small"
          >
            详情
          </Button>
          <Button
            icon={<EditOutlined />}
            onClick={() => showStatusUpdateModal(record)}
            size="small"
            disabled={record.status === 'cancelled' || record.status === 'delivered'}
          >
            更新状态
          </Button>
        </Space>
      ),
      width: 180,
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>订单管理</Title>

      <Card>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={orders}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: 1200 }}
          />
        )}
      </Card>

      {/* 订单详情模态框 */}
      <Modal
        title="订单详情"
        open={detailsVisible}
        onCancel={() => setDetailsVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailsVisible(false)}>
            关闭
          </Button>,
        ]}
        width={700}
      >
        {selectedOrder && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <Text strong>订单ID:</Text> {selectedOrder.id}
              <br />
              <Text strong>用户:</Text> {selectedOrder.user?.username}
              <br />
              <Text strong>创建时间:</Text> {new Date(selectedOrder.createdAt).toLocaleString()}
              <br />
              <Text strong>状态:</Text>{' '}
              <Tag color={getStatusColor(selectedOrder.status)}>
                {getStatusText(selectedOrder.status)}
              </Tag>
              <br />
              <Text strong>支付状态:</Text>{' '}
              <Tag color={selectedOrder.isPaid ? 'green' : 'volcano'}>
                {selectedOrder.isPaid ? '已支付' : '未支付'}
              </Tag>
              <br />
              <Text strong>收货地址:</Text> {selectedOrder.shippingAddress}
              <br />
              <Text strong>支付方式:</Text> {selectedOrder.paymentMethod}
            </div>

            <Title level={5}>订单商品</Title>
            <Table
              columns={[
                {
                  title: '商品ID',
                  dataIndex: ['product', 'id'],
                  key: 'productId',
                  width: 80,
                },
                {
                  title: '商品名称',
                  dataIndex: ['product', 'name'],
                  key: 'productName',
                },
                {
                  title: '单价',
                  dataIndex: 'price',
                  key: 'price',
                  render: (price) => `¥${price.toFixed(2)}`,
                },
                {
                  title: '数量',
                  dataIndex: 'quantity',
                  key: 'quantity',
                },
                {
                  title: '小计',
                  key: 'subtotal',
                  render: (_, record) =>
                    `¥${(record.price * record.quantity).toFixed(2)}`,
                },
              ]}
              dataSource={selectedOrder.orderItems}
              rowKey="id"
              pagination={false}
              summary={() => (
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={4} align="right">
                    <Text strong>总计:</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1}>
                    <Text strong>¥{selectedOrder.totalAmount.toFixed(2)}</Text>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              )}
            />
          </div>
        )}
      </Modal>

      {/* 更新状态模态框 */}
      <Modal
        title="更新订单状态"
        open={statusUpdateVisible}
        onCancel={() => setStatusUpdateVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setStatusUpdateVisible(false)}>
            取消
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={updatingStatus}
            onClick={updateOrderStatus}
          >
            更新
          </Button>,
        ]}
      >
        <div style={{ marginBottom: '20px' }}>
          <Text>当前状态: </Text>
          <Tag color={getStatusColor(selectedOrder?.status)}>
            {getStatusText(selectedOrder?.status)}
          </Tag>
        </div>

        <div>
          <Text>新状态: </Text>
          <Select
            value={selectedStatus}
            onChange={setSelectedStatus}
            style={{ width: 200 }}
          >
            <Option value="pending">待处理</Option>
            <Option value="processing">处理中</Option>
            <Option value="shipped">已发货</Option>
            <Option value="delivered">已送达</Option>
            <Option value="cancelled">已取消</Option>
          </Select>
        </div>
      </Modal>
    </div>
  );
};

export default OrdersManagementPage;