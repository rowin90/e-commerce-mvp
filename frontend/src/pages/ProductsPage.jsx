import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Typography, Card, Row, Col, Button, Badge, message, Input, Select, Spin } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { addToCart } from '../store/cartSlice';
import { getProducts } from '../store/productsSlice';
import CartDrawer from '../components/CartDrawer';
import './ProductsPage.css'; // 引入CSS文件，用于购物车动画

const { Title, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

const ProductsPage = () => {
  const dispatch = useDispatch();
  const [cartVisible, setCartVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [flyingItem, setFlyingItem] = useState(null);
  
  const { items: products, status, error } = useSelector((state) => state.products);
  const { totalQuantity } = useSelector((state) => state.cart);
  
  // 组件挂载时获取商品数据
  useEffect(() => {
    if (status === 'idle') {
      dispatch(getProducts());
    }
  }, [dispatch, status]);
  
  // 只显示上架的商品
  const availableProducts = products.filter(product => product.isActive);
  
  // 搜索和排序
  const filteredProducts = availableProducts
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'priceAsc') return a.price - b.price;
      if (sortBy === 'priceDesc') return b.price - a.price;
      if (sortBy === 'nameAsc') return a.name.localeCompare(b.name);
      return 0; // default
    });

  const handleAddToCart = (product, event) => {
    if (product.stock > 0) {
      // 获取点击按钮的位置作为动画起点
      const buttonRect = event.target.getBoundingClientRect();
      const buttonX = buttonRect.left + buttonRect.width / 2;
      const buttonY = buttonRect.top + buttonRect.height / 2;
      
      // 获取购物车按钮位置作为动画终点
      const cartButton = document.getElementById('cart-button');
      const cartRect = cartButton.getBoundingClientRect();
      const cartX = cartRect.left + cartRect.width / 2;
      const cartY = cartRect.top + cartRect.height / 2;
      
      // 设置飞入动画起始位置和目标位置
      setFlyingItem({
        id: Date.now(),
        product,
        startX: buttonX,
        startY: buttonY,
        endX: cartX,
        endY: cartY
      });
      
      // 动画结束后添加到购物车
      setTimeout(() => {
        dispatch(addToCart(product));
        message.success(`已将 ${product.name} 加入购物车`);
        setFlyingItem(null);
      }, 800); // 动画持续时间
    } else {
      message.error('该商品已售罄');
    }
  };

  const showCart = () => {
    setCartVisible(true);
  };

  const closeCart = () => {
    setCartVisible(false);
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Title level={2}>商品列表</Title>
        <Badge count={totalQuantity} showZero>
          <Button 
            type="primary" 
            icon={<ShoppingCartOutlined />} 
            size="large"
            onClick={showCart}
            id="cart-button" // 添加ID，用于飞入动画定位
          >
            购物车
          </Button>
        </Badge>
      </div>
      
      {/* 飞入购物车的动画元素 */}
      {flyingItem && (
        <div
          className="flying-item"
          style={{
            left: `${flyingItem.startX}px`,
            top: `${flyingItem.startY}px`,
            '--end-x': `${flyingItem.endX - flyingItem.startX}px`,
            '--end-y': `${flyingItem.endY - flyingItem.startY}px`,
          }}
        >
          <img 
            src={flyingItem.product.image} 
            alt="" 
            style={{ width: '30px', height: '30px', borderRadius: '50%' }} 
          />
        </div>
      )}
      
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <Search
          placeholder="搜索商品"
          allowClear
          enterButton
          style={{ maxWidth: '400px' }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select 
          defaultValue="default" 
          style={{ width: 120 }} 
          onChange={setSortBy}
        >
          <Option value="default">默认排序</Option>
          <Option value="priceAsc">价格从低到高</Option>
          <Option value="priceDesc">价格从高到低</Option>
          <Option value="nameAsc">名称排序</Option>
        </Select>
      </div>

      {status === 'loading' ? (
        <div style={{ textAlign: 'center', margin: '40px 0' }}>
          <Spin size="large" tip="加载商品中..." />
        </div>
      ) : status === 'failed' ? (
        <div style={{ textAlign: 'center', margin: '40px 0' }}>
          <Paragraph>加载商品失败: {error}</Paragraph>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div style={{ textAlign: 'center', margin: '40px 0' }}>
          <Paragraph>没有找到匹配的商品</Paragraph>
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {filteredProducts.map((product) => (
            <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
              <Card
                hoverable
                cover={
                  <img
                    alt={product.name}
                    src={product.image}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                }
                actions={[
                  <Button 
                    type="primary" 
                    onClick={(e) => handleAddToCart(product, e)}
                    disabled={product.stock <= 0}
                  >
                    {product.stock > 0 ? '加入购物车' : '已售罄'}
                  </Button>
                ]}
              >
                <Card.Meta
                  title={<span>{product.name} <span style={{color: '#f5222d'}}>¥{product.price.toFixed(2)}</span></span>}
                  description={
                    <>
                      <Paragraph ellipsis={{ rows: 2 }}>{product.description}</Paragraph>
                      <Paragraph>库存: {product.stock}</Paragraph>
                    </>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <CartDrawer visible={cartVisible} onClose={closeCart} />
    </div>
  );
};

export default ProductsPage;