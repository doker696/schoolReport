import {Col, Layout, Menu, Row} from 'antd';
import React from 'react';
import {Link} from 'react-router-dom';

type Props = {
  isAuthenticate: boolean;
  setIsAuthenticate: (value: boolean) => void;
};

const Header = (props: Props) => {
  const logout = () => {
    props.setIsAuthenticate(false)
  }
  return (
    <Layout.Header className='header'>
      <Row gutter={2} align='middle'>
        <Col span={8}>
          <Menu className='menu' mode='horizontal' >
            <Menu.Item key='1'>
              <Link to={'/'}>Главная</Link>
            </Menu.Item>
            <Menu.Item key='2'>
              <Link to={'/publications'}>Публикации</Link>
            </Menu.Item>
            <Menu.Item key='3'>
              <Link to={'/contacts'}>Контакты</Link>
            </Menu.Item>
          </Menu>
        </Col>
        <Col offset={14} span={2}>
          <Menu className='menu' mode='horizontal' >

            {props.isAuthenticate?
              <Menu.Item key='logout' onClick={logout}>
                Выйти
              </Menu.Item>
              :
              <Menu.Item key='login'>
                <Link to={'/login'}>Войти</Link>
              </Menu.Item>
            }
          </Menu>
        </Col>

      </Row>
    </Layout.Header>
  );
};
export default Header;
