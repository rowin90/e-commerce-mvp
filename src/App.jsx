import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Layout, Menu, theme } from 'antd';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import AdminPage from './pages/AdminPage';

const { Header, Content, Footer } = Layout;

const App = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout className="layout">
      <Header style={{ display: 'flex', alignItems: 'center' }}>
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
            { key: '3', label: <Link to="/admin">管理后台</Link> },
          ]}
        />
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <div className="site-layout-content" style={{ margin: '16px 0', padding: 24, background: colorBgContainer, borderRadius: borderRadiusLG }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/admin" element={<AdminPage />} />
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