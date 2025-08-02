import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Steps, Radio, List, Typography, Divider, message, Result } from 'antd';
import { ShoppingCartOutlined, UserOutlined, CreditCardOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { createOrder } from '../services/api';
import { clearCart } from '../store/cartSlice';

const { Title, Text } = Typography;
const { Step } = Steps;

const CheckoutPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [orderForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const cartItems = useSelector((state) => state.cart.items);
  const totalAmount = useSelector((state) => state.cart.totalAmount);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 检查购物车是否为空
  if (cartItems.length === 0 && currentStep === 0) {
    return (
      <Result
        status='warning'
        title='您的购物车是空的'
        subTitle='请先添加商品到购物车再进行结账'
        extra={
          <Button type='primary' onClick={() => navigate('/products')}>
            去购物
          </Button>
        }
      />
    );
  }

  // 处理下一步
  const handleNext = () => {
    if (currentStep === 0) {
      setCurrentStep(1);
    } else if (currentStep === 1) {
      orderForm.validateFields().then(() => {
        setCurrentStep(2);
      });
    }
  };

  // 处理上一步
  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  // 提交订单
  const handleSubmitOrder = async () => {
    try {
      setLoading(true);

      // 调试：检查表单当前值
      const allFields = orderForm.getFieldsValue(true);
      console.log('表单当前所有值:', allFields);
      console.log('表单实例:', orderForm);
      console.log('表单是否为空对象:', Object.keys(allFields).length === 0);

      // 逐个检查字段值
      console.log('name:', orderForm.getFieldValue('name'));
      console.log('phone:', orderForm.getFieldValue('phone'));
      console.log('province:', orderForm.getFieldValue('province'));
      console.log('city:', orderForm.getFieldValue('city'));
      console.log('district:', orderForm.getFieldValue('district'));
      console.log('address:', orderForm.getFieldValue('address'));
      console.log('paymentMethod:', orderForm.getFieldValue('paymentMethod'));

      const values = await orderForm.validateFields();
      console.log('验证后的表单值:', values);

      // 构建完整的收货地址，过滤掉空值
      const addressParts = [
        allFields.province,
        allFields.city,
        allFields.district,
        allFields.address,
      ].filter((part) => part && part.trim() !== '');

      const shippingAddress = addressParts.join(' ');

      // 准备订单数据
      const orderData = {
        totalAmount,
        status: 'pending',
        shippingAddress,
        paymentMethod: allFields.paymentMethod || 'CASH_ON_DELIVERY', // 确保有默认值
        isPaid: false,
        orderItems: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      console.log('提交的订单数据:', orderData); // 调试日志

      // 创建订单
      const result = await createOrder(orderData);
      setOrderId(result.id);

      // 清空购物车
      dispatch(clearCart());

      // 进入完成步骤
      setCurrentStep(3);
    } catch (error) {
      console.error('提交订单失败:', error);
      console.error('错误详情:', error);
      message.error('提交订单失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  // 步骤配置
  const steps = [
    {
      title: '确认商品',
      icon: <ShoppingCartOutlined />,
    },
    {
      title: '收货信息',
      icon: <UserOutlined />,
    },
    {
      title: '确认订单',
      icon: <CreditCardOutlined />,
    },
    {
      title: '完成',
      icon: <CheckCircleOutlined />,
    },
  ];

  // 渲染步骤内容
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Card title='购物车商品'>
            <List
              itemLayout='horizontal'
              dataSource={cartItems}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={item.name}
                    description={
                      <>
                        <Text>单价: ¥{item.price.toFixed(2)}</Text>
                        <br />
                        <Text>数量: {item.quantity}</Text>
                      </>
                    }
                  />
                  <div>¥{(item.price * item.quantity).toFixed(2)}</div>
                </List.Item>
              )}
              footer={
                <div style={{ textAlign: 'right' }}>
                  <Text strong>总计: ¥{totalAmount.toFixed(2)}</Text>
                </div>
              }
            />
          </Card>
        );
      case 1:
        return (
          <Card title='填写收货信息'>
            <div style={{ padding: '0 24px' }}>
              <Form.Item
                name='name'
                label='收货人姓名'
                rules={[{ required: true, message: '请输入收货人姓名' }]}
              >
                <Input placeholder='请输入收货人姓名' />
              </Form.Item>

              <Form.Item
                name='phone'
                label='联系电话'
                rules={[
                  { required: true, message: '请输入联系电话' },
                  { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码' },
                ]}
              >
                <Input placeholder='请输入联系电话' />
              </Form.Item>

              <Form.Item
                name='province'
                label='省份'
                rules={[{ required: true, message: '请输入省份' }]}
              >
                <Input placeholder='请输入省份' />
              </Form.Item>

              <Form.Item
                name='city'
                label='城市'
                rules={[{ required: true, message: '请输入城市' }]}
              >
                <Input placeholder='请输入城市' />
              </Form.Item>

              <Form.Item
                name='district'
                label='区/县'
                rules={[{ required: true, message: '请输入区/县' }]}
              >
                <Input placeholder='请输入区/县' />
              </Form.Item>

              <Form.Item
                name='address'
                label='详细地址'
                rules={[{ required: true, message: '请输入详细地址' }]}
              >
                <Input.TextArea placeholder='请输入详细地址' rows={3} />
              </Form.Item>

              <Divider orientation='left'>支付方式</Divider>

              <Form.Item
                name='paymentMethod'
                rules={[{ required: true, message: '请选择支付方式' }]}
              >
                <Radio.Group>
                  <Radio value='CASH_ON_DELIVERY'>货到付款</Radio>
                  <Radio value='ONLINE_PAYMENT'>在线支付</Radio>
                  <Radio value='BANK_TRANSFER'>银行转账</Radio>
                </Radio.Group>
              </Form.Item>
            </div>
          </Card>
        );
      case 2:
        return (
          <Card title='订单确认'>
            <div style={{ marginBottom: 20 }}>
              <Title level={5}>商品信息</Title>
              <List
                itemLayout='horizontal'
                dataSource={cartItems}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      title={item.name}
                      description={`数量: ${item.quantity}`}
                    />
                    <div>¥{(item.price * item.quantity).toFixed(2)}</div>
                  </List.Item>
                )}
              />
            </div>

            <Divider />

            <div style={{ marginBottom: 20 }}>
              <Title level={5}>收货信息</Title>
              {orderForm.getFieldValue('name') && (
                <>
                  <p>
                    <strong>收货人:</strong> {orderForm.getFieldValue('name')}
                  </p>
                  <p>
                    <strong>联系电话:</strong>{' '}
                    {orderForm.getFieldValue('phone')}
                  </p>
                  <p>
                    <strong>收货地址:</strong>{' '}
                    {orderForm.getFieldValue('province')}{' '}
                    {orderForm.getFieldValue('city')}{' '}
                    {orderForm.getFieldValue('district')}{' '}
                    {orderForm.getFieldValue('address')}
                  </p>
                  <p>
                    <strong>支付方式:</strong>{' '}
                    {
                      {
                        CASH_ON_DELIVERY: '货到付款',
                        ONLINE_PAYMENT: '在线支付',
                        BANK_TRANSFER: '银行转账',
                      }[orderForm.getFieldValue('paymentMethod')]
                    }
                  </p>
                </>
              )}
            </div>

            <Divider />

            <div style={{ textAlign: 'right' }}>
              <Text strong style={{ fontSize: 16 }}>
                订单总计: ¥{totalAmount.toFixed(2)}
              </Text>
            </div>
          </Card>
        );
      case 3:
        return (
          <Result
            status='success'
            title='订单提交成功！'
            subTitle={`订单号: ${orderId}`}
            extra={[
              <Button
                type='primary'
                key='profile'
                onClick={() => navigate('/profile')}
              >
                查看我的订单
              </Button>,
              <Button key='buy' onClick={() => navigate('/products')}>
                继续购物
              </Button>,
            ]}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <Title level={2}>结账</Title>

      <Steps current={currentStep} style={{ marginBottom: 30 }}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title} icon={item.icon} />
        ))}
      </Steps>

      {/* 表单始终在DOM中，通过Form.Provider确保数据共享 */}
      <Form
        form={orderForm}
        layout='vertical'
        initialValues={{
          paymentMethod: 'CASH_ON_DELIVERY',
        }}
      >
        <div className='steps-content'>{renderStepContent()}</div>
      </Form>

      <div
        className='steps-action'
        style={{ marginTop: 24, textAlign: 'right' }}
      >
        {currentStep > 0 && currentStep < 3 && (
          <Button style={{ marginRight: 8 }} onClick={handlePrev}>
            上一步
          </Button>
        )}

        {currentStep < 2 && (
          <Button type='primary' onClick={handleNext}>
            下一步
          </Button>
        )}

        {currentStep === 2 && (
          <Button type='primary' onClick={handleSubmitOrder} loading={loading}>
            提交订单
          </Button>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;