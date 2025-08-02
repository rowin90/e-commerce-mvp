import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Drawer, List, Button, Typography, InputNumber, Empty, Divider } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { addToCart, removeFromCart, clearItemFromCart } from '../store/cartSlice';

const { Title, Text } = Typography;

const CartDrawer = ({ visible, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalQuantity, totalAmount } = useSelector((state) => state.cart);

  const handleIncreaseQuantity = (item) => {
    dispatch(addToCart(item));
  };

  const handleDecreaseQuantity = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleRemoveItem = (id) => {
    dispatch(clearItemFromCart(id));
  };

  return (
    <Drawer
      title={`购物车 (${totalQuantity}件商品)`}
      placement="right"
      onClose={onClose}
      open={visible}
      width={400}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Title level={4} style={{ margin: '16px 0' }}>
            总计: ¥{totalAmount.toFixed(2)}
          </Title>
          <Button 
            type="primary" 
            size="large" 
            disabled={items.length === 0}
            onClick={() => {
              onClose();
              navigate('/checkout');
            }}
          >
            结算
          </Button>
        </div>
      }
    >
      {items.length === 0 ? (
        <Empty description="购物车是空的" />
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={items}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button
                  icon={<DeleteOutlined />}
                  onClick={() => handleRemoveItem(item.id)}
                  danger
                />,
              ]}
            >
              <List.Item.Meta
                avatar={<img src={item.image} alt={item.name} style={{ width: 50, height: 50, objectFit: 'cover' }} />}
                title={item.name}
                description={<Text type="secondary">¥{item.price.toFixed(2)}</Text>}
              />
              <div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Button
                    size="small"
                    onClick={() => handleDecreaseQuantity(item.id)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </Button>
                  <InputNumber
                    min={1}
                    max={99}
                    value={item.quantity}
                    readOnly
                    style={{ width: '50px', margin: '0 8px' }}
                  />
                  <Button
                    size="small"
                    onClick={() => handleIncreaseQuantity(item)}
                  >
                    +
                  </Button>
                </div>
                <Text strong style={{ display: 'block', marginTop: '8px' }}>
                  小计: ¥{(item.price * item.quantity).toFixed(2)}
                </Text>
              </div>
            </List.Item>
          )}
        />
      )}
      {items.length > 0 && (
        <Divider style={{ margin: '12px 0' }} />
      )}
    </Drawer>
  );
};

export default CartDrawer;