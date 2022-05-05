import {Button, Form, Input} from 'antd';
import {LockOutlined, UserOutlined} from '@ant-design/icons';
import {register} from "../api";

type Props = {
  isAuthenticate: boolean;
  setIsAuthenticate: (value: boolean) => void;
  setIsAdmin: (value: boolean) => void;
};

const Register = (props: Props) => {
  const onFinish = (values: any) => {
    register({username: values.username, password: values.password}).then((res) => {
      if (res.status == 200) {
        props.setIsAuthenticate(true)
        props.setIsAdmin(res.data.is_admin === 1)
      }
      console.log(res.data)
    });
  };

  return (
    <Form
      name="normal_login"
      className="login-form"
      initialValues={{ remember: true }}
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
  );
};
export default Register;