import React, { useState, useEffect } from 'react';
import { Card, Tabs, Typography, Descriptions, List, Tag, Button, Spin, Empty, message } from 'antd';
import { ShoppingOutlined, UserOutlined, HistoryOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getProfile, getMyOrders, getOrderDetails, cancelOrder } from '../services/api';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);
  const navigate = useNavigate();

  // 获取用户信息
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userData = await getProfile();
        setProfile(userData);
      } catch (error) {
        console.error('获取用户信息失败:', error);
        message.error('获取用户信息失败');
        // 如果获取用户信息失败，可能是未登录或令牌过期
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    const fetchOrders = async () => {
      try {
        const ordersData = await getMyOrders();
        setOrders(ordersData);
      } catch (error) {
        console.error('获取订单历史失败:', error);
        message.error('获取订单历史失败');
      }
    };

    fetchProfile();
    fetchOrders();
  }, [navigate]);

  // 查看订单详情
  const handleViewOrder = async (orderId) => {
    setOrderLoading(true);
    try {
      const orderDetails = await getOrderDetails(orderId);
      setSelectedOrder(orderDetails);
    } catch (error) {
      console.error('获取订单详情失败:', error);
      message.error('获取订单详情失败');
    } finally {
      setOrderLoading(false);
    }
  };

  // 取消订单
  const handleCancelOrder = async (orderId) => {
    try {
      await cancelOrder(orderId);
      message.success('订单已取消');
      
      // 刷新订单列表
      const updatedOrders = await getMyOrders();
      setOrders(updatedOrders);
      
      // 如果当前正在查看的订单被取消，更新订单详情
      if (selectedOrder && selectedOrder.id === orderId) {
        const updatedOrder = await getOrderDetails(orderId);
        setSelectedOrder(updatedOrder);
      }
    } catch (error) {
      console.error('取消订单失败:', error);
      message.error('取消订单失败');
    }
  };

  // 获取订单状态标签
  const getStatusTag = (status) => {
    const statusMap = {
      'pending': { color: 'blue', text: '待处理' },
      'processing': { color: 'orange', text: '处理中' },
      'shipped': { color: 'purple', text: '已发货' },
      'delivered': { color: 'green', text: '已送达' },
      'cancelled': { color: 'red', text: '已取消' },
    };
    
    const statusInfo = statusMap[status] || { color: 'default', text: status };
    return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <Title level={2}>个人中心</Title>
      
      <Tabs defaultActiveKey="profile">
        <TabPane 
          tab={<span><UserOutlined />个人信息</span>} 
          key="profile"
        >
          <Card>
            <Descriptions title="基本信息" bordered>
              <Descriptions.Item label="用户名" span={3}>{profile?.username}</Descriptions.Item>
              <Descriptions.Item label="邮箱" span={3}>{profile?.email}</Descriptions.Item>
              <Descriptions.Item label="角色" span={3}>
                {profile?.role === 'admin' ? '管理员' : '普通用户'}
              </Descriptions.Item>
              <Descriptions.Item label="注册时间" span={3}>
                {new Date(profile?.createdAt).toLocaleString()}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </TabPane>
        
        <TabPane 
          tab={<span><HistoryOutlined />订单历史</span>} 
          key="orders"
        >
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ flex: 1 }}>
              <Card title="我的订单">
                {orders.length > 0 ? (
                  <List
                    itemLayout="horizontal"
                    dataSource={orders}
                    renderItem={(order) => (
                      <List.Item
                        actions={[
                          <Button 
                            type="link" 
                            onClick={() => handleViewOrder(order.id)}
                          >
                            查看详情
                          </Button>,
                          order.status === 'pending' && (
                            <Button 
                              type="link" 
                              danger 
                              onClick={() => handleCancelOrder(order.id)}
                            >
                              取消订单
                            </Button>
                          )
                        ].filter(Boolean)}
                      >
                        <List.Item.Meta
                          title={<span>订单 #{order.id} {getStatusTag(order.status)}</span>}
                          description={
                            <>
                              <div>下单时间: {new Date(order.createdAt).toLocaleString()}</div>
                              <div>总金额: ¥{order.totalAmount.toFixed(2)}</div>
                            </>
                          }
                        />
                      </List.Item>
                    )}
                  />
                ) : (
                  <Empty description="暂无订单" />
                )}
              </Card>
            </div>
            
            <div style={{ flex: 1 }}>
              <Card title="订单详情">
                {orderLoading ? (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                    <Spin />
                  </div>
                ) : selectedOrder ? (
                  <>
                    <Descriptions bordered size="small" column={1}>
                      <Descriptions.Item label="订单编号">#{selectedOrder.id}</Descriptions.Item>
                      <Descriptions.Item label="订单状态">{getStatusTag(selectedOrder.status)}</Descriptions.Item>
                      <Descriptions.Item label="下单时间">{new Date(selectedOrder.createdAt).toLocaleString()}</Descriptions.Item>
                      <Descriptions.Item label="总金额">¥{selectedOrder.totalAmount.toFixed(2)}</Descriptions.Item>
                      <Descriptions.Item label="收货地址">{selectedOrder.shippingAddress}</Descriptions.Item>
                      <Descriptions.Item label="支付方式">{selectedOrder.paymentMethod}</Descriptions.Item>
                      <Descriptions.Item label="支付状态">{selectedOrder.isPaid ? '已支付' : '未支付'}</Descriptions.Item>
                      {selectedOrder.isPaid && (
                        <Descriptions.Item label="支付时间">{new Date(selectedOrder.paidAt).toLocaleString()}</Descriptions.Item>
                      )}
                    </Descriptions>
                    
                    <Title level={5} style={{ margin: '20px 0 10px' }}>订单商品</Title>
                    <List
                      itemLayout="horizontal"
                      dataSource={selectedOrder.orderItems}
                      renderItem={(item) => (
                        <List.Item>
                          <List.Item.Meta
                            title={item.product.name}
                            description={
                              <>
                                <div>单价: ¥{item.price.toFixed(2)}</div>
                                <div>数量: {item.quantity}</div>
                              </>
                            }
                          />
                          <div>¥{item.totalPrice.toFixed(2)}</div>
                        </List.Item>
                      )}
                    />
                  </>
                ) : (
                  <Empty description="请选择一个订单查看详情" />
                )}
              </Card>
            </div>
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default ProfilePage;