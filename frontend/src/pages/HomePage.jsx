import React from 'react';
import { Typography, Card, Row, Col, Button } from 'antd';
import { Link } from 'react-router-dom';

// 导入本地图片
import qualityImg from '../assets/images/quality.svg';
import deliveryImg from '../assets/images/delivery.svg';
import serviceImg from '../assets/images/service.svg';
import electronicsImg from '../assets/images/electronics.svg';
import homeImg from '../assets/images/home.svg';
import fashionImg from '../assets/images/fashion.svg';
import beautyImg from '../assets/images/beauty.svg';

const { Title, Paragraph } = Typography;

const HomePage = () => {
  return (
    <div className="container">
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <Title level={1}>欢迎来到我们的电商平台</Title>
        <Paragraph style={{ fontSize: '18px' }}>
          我们提供各种高品质的商品，满足您的各种需求
        </Paragraph>
        <Link to="/products">
          <Button type="primary" size="large">
            立即购物
          </Button>
        </Link>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} sm={8}>
          <Card
            hoverable
            cover={<img alt="高品质" src={qualityImg} />}
          >
            <Card.Meta
              title="高品质商品"
              description="我们精选各类优质商品，确保每一件都符合高标准"
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card
            hoverable
            cover={<img alt="快速配送" src={deliveryImg} />}
          >
            <Card.Meta
              title="快速配送"
              description="下单后迅速发货，让您尽快收到心仪的商品"
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card
            hoverable
            cover={<img alt="优质服务" src={serviceImg} />}
          >
            <Card.Meta
              title="优质服务"
              description="专业的客服团队，为您提供贴心的购物体验"
            />
          </Card>
        </Col>
      </Row>

      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <Title level={2}>热门商品分类</Title>
        <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card hoverable>
              <div style={{ textAlign: 'center' }}>
                <img
                  src={electronicsImg}
                  alt="电子产品"
                  style={{ width: '100px', height: '100px', marginBottom: '10px' }}
                />
                <Title level={4}>电子产品</Title>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card hoverable>
              <div style={{ textAlign: 'center' }}>
                <img
                  src={homeImg}
                  alt="家居用品"
                  style={{ width: '100px', height: '100px', marginBottom: '10px' }}
                />
                <Title level={4}>家居用品</Title>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card hoverable>
              <div style={{ textAlign: 'center' }}>
                <img
                  src={fashionImg}
                  alt="服装鞋包"
                  style={{ width: '100px', height: '100px', marginBottom: '10px' }}
                />
                <Title level={4}>服装鞋包</Title>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card hoverable>
              <div style={{ textAlign: 'center' }}>
                <img
                  src={beautyImg}
                  alt="美妆护肤"
                  style={{ width: '100px', height: '100px', marginBottom: '10px' }}
                />
                <Title level={4}>美妆护肤</Title>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default HomePage;