import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import { Layout, Menu, theme, Button, Dropdown, Avatar, Space, Badge } from 'antd';
import { UserOutlined, LogoutOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersManagementPage from './pages/OrdersManagementPage';
import { logout } from './services/api';
import { useSelector } from 'react-redux';

const { Header, Content, Footer } = Layout;

const App = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  
  useEffect(() => {
    // 从本地存储中获取用户信息
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <Layout className="layout">
      <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className="demo-logo" style={{ color: 'white', fontWeight: 'bold', fontSize: '18px', marginRight: '20px' }}>
            电商MVP
          </div>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['1']}
            items={[
              { key: '1', label: <Link to="/">首页</Link> },
              { key: '2', label: <Link to="/products">商品列表</Link> },
              user?.role === 'admin' ? { key: '3', label: <Link to="/admin">管理后台</Link> } : null,
            ].filter(Boolean)}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {user ? (
            <>
              <Link to="/products" style={{ marginRight: '20px' }}>
                <Badge count={cartItems.length} showZero>
                  <Button type="text" icon={<ShoppingCartOutlined style={{ color: 'white', fontSize: '18px' }} />} />
                </Badge>
              </Link>
              <Dropdown
                menu={{
                  items: [
                    {
                      key: '1',
                      icon: <UserOutlined />,
                      label: '个人中心',
                      onClick: () => navigate('/profile'),
                    },
                    {
                      key: '2',
                      icon: <LogoutOutlined />,
                      label: '退出登录',
                      onClick: () => {
                        logout();
                        setUser(null);
                        navigate('/');
                      },
                    },
                  ],
                }}
              >
                <Space style={{ color: 'white', cursor: 'pointer' }}>
                  <Avatar icon={<UserOutlined />} />
                  {user.username}
                </Space>
              </Dropdown>
            </>
          ) : (
            <Space>
              <Button type="link" onClick={() => navigate('/login')} style={{ color: 'white' }}>
                登录
              </Button>
              <Button type="primary" onClick={() => navigate('/register')}>
                注册
              </Button>
            </Space>
          )}
        </div>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <div className="site-layout-content" style={{ margin: '16px 0', padding: 24, background: colorBgContainer, borderRadius: borderRadiusLG }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/admin" element={user?.role === 'admin' ? <AdminPage /> : <Navigate to="/login" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/login" />} />
            <Route path="/checkout" element={user ? <CheckoutPage /> : <Navigate to="/login" />} />
            <Route path="/orders-management" element={user?.role === 'admin' ? <OrdersManagementPage /> : <Navigate to="/login" />} />
          </Routes>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        电商MVP ©{new Date().getFullYear()} Created by React
      </Footer>
    </Layout>
  );
};

export default App;