import { Col, Layout, Menu, Row, Typography } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

type Props = {};
const Header = (props: Props) => {
  return (
    <Layout.Header className='header'>
      <Row gutter={2} align='middle'>
        <Col span={8}>
          <Menu className='menu' mode='horizontal' >
            <Menu.Item key='1'>
              <Link to={'/'}>Главная</Link>
            </Menu.Item>
            <Menu.Item key='2'>
              <Link to={'/contacts'}>Контакты</Link>
            </Menu.Item>
          </Menu>
        </Col>
      </Row>
    </Layout.Header>
  );
};
export default Header;
