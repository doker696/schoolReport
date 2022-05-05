import { Button, Col, Row, Typography } from 'antd';
import React from 'react';

type Props = {};

const Contacts = (props: Props) => {
  return (
    <div style={{border:'1px solid white', padding:'35px 70px', maxWidth:'900px', margin:'auto', boxShadow: '0px 0px 12px 0px #b5b5b5'}}>
      <Typography.Title>Контакты</Typography.Title>
      <Row>
        <Col>
          <Typography.Text style={{fontSize:'120%'}} >Здравствуйте, я Иванов Иван Иванович, связаться со мной можно следующими способами:</Typography.Text>
          <div>Email:&nbsp;&nbsp;example@example.com</div>
          <div>Рабочий Email:&nbsp;&nbsp;example2@example.com</div>
          <div>Телефон:&nbsp;&nbsp;89377777777</div>
        </Col>
      </Row>
    </div>
  );
};

export default Contacts;
