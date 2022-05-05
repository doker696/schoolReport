import { Button, Col, Row, Typography } from 'antd';
import React from 'react';

type Props = {};

const Publications = (props: Props) => {
  return (
      <div style={{border:'1px solid white', padding:'35px 70px', maxWidth:'900px', margin:'auto', boxShadow: '0px 0px 12px 0px #b5b5b5'}}>
          <Typography.Title>Список публикаций</Typography.Title>
          <Typography.Title level={3}>Публикация 1</Typography.Title>
          <Typography.Text>Иванов И.И. Петров П.П.// Журнал научный Пермь 2022 С.- 22-30</Typography.Text>
          <Typography.Title level={3}>Публикация 2</Typography.Title>
          <Typography.Text>Иванов И.И. Сидоров С.С Петров П.П.// Журнал научный вестник Москва 2019 С.- 220-222</Typography.Text>
          <Typography.Title level={3}>Publication 3</Typography.Title>
          <Typography.Text>Ivanov I.I. // Nature 2018 С.- 2-5</Typography.Text>
          <Typography.Title level={3}>Публикация 4</Typography.Title>
          <Typography.Text>Иванов И.И. // Журнал в путь Пенза 2017 С.- 66-68</Typography.Text>
      </div>
  );
};

export default Publications;
