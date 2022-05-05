import {Button, Col, Form, Input, Row} from 'antd';
import {LockOutlined, UserOutlined} from '@ant-design/icons';
import {register} from "../api";
import {useNavigate} from "react-router-dom";

type Props = {
  isAuthenticate: boolean;
  setIsAuthenticate: (value: boolean) => void;
  setIsAdmin: (value: boolean) => void;
};

const Register = (props: Props) => {
  const navigate = useNavigate();

  const onFinish = (values: any) => {
    register({username: values.username, password: values.password}).then((res) => {
      if (res.status == 200) {
        props.setIsAuthenticate(true)
        props.setIsAdmin(res.data.is_admin === 1)
      }
      console.log(res.data)
      navigate('/');
    });
  };

  return (
    <Row>
      <Col offset={9} span={6}>
        <Form
          name="normal_login"
          className="login-form"
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Пожалуйста введите имя пользователя!' }]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Имя пользователя" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Пожалуйста введите пароль!' }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Пароль"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Зарегистрироваться
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};
export default Register;