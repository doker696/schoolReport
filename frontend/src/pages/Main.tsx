import { Card, Col, Divider, List, Row, Typography } from 'antd';
import moment from 'moment';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { DATE_FORMAT } from '../consts';
import { Schedule } from '../dto';

type Props = {};

const schedule: Schedule[] = [
  {
    id: 1,
    classRoom: {
      id: 1,
      name: '7A309',
    },
    subject: {
      id: 1,
      name: 'Математика',
    },
    date: '10.04.2022',
    startTime: '08:00',
    endTime: '08:40',
  },
  {
    id: 2,
    classRoom: {
      id: 1,
      name: '7A309',
    },
    subject: {
      id: 2,
      name: 'Русский язык',
    },
    date: '10.04.2022',
    startTime: '08:45',
    endTime: '09:25',
  },
  {
    id: 3,
    classRoom: {
      id: 2,
      name: '7A320',
    },
    subject: {
      id: 1,
      name: 'Математика',
    },
    date: '10.04.2022',
    startTime: '09:35',
    endTime: '10:15',
  },
  {
    id: 4,
    classRoom: {
      id: 1,
      name: '7A309',
    },
    subject: {
      id: 1,
      name: 'Математика',
    },
    date: '09.04.2022',
    startTime: '08:00',
    endTime: '08:40',
  },
  {
    id: 5,
    classRoom: {
      id: 1,
      name: '7A309',
    },
    subject: {
      id: 2,
      name: 'Русский язык',
    },
    date: '09.04.2022',
    startTime: '08:45',
    endTime: '09:25',
  },
  {
    id: 6,
    classRoom: {
      id: 2,
      name: '7A320',
    },
    subject: {
      id: 1,
      name: 'Математика',
    },
    date: '09.04.2022',
    startTime: '09:35',
    endTime: '10:15',
  },
];

const genetateDateItem = (
  dateNow: string,
  i: number,
  _sсhedule: Schedule[]
) => {
  const date = moment(dateNow, DATE_FORMAT).add(i, 'days').format(DATE_FORMAT);
  const lessons: {class: string, name: string, time: string}[] = _sсhedule.filter(el => el.date === date).map( el =>({
    class: el.classRoom.name,
    name: el.subject.name,
    time: el.startTime + '-' + el.endTime
  }))
  return (
    <Col span={3}>
      <List
        className={date === moment(Date.now()).format(DATE_FORMAT) ? 'today' : ''}
        size='small'
        header={
          <div>
            {date} <Divider style={{ margin: '10px 0 0 0' }} />
          </div>
        }
        bordered
        dataSource={lessons}
        locale={{ emptyText: 'Нет уроков!' }}
        renderItem={(item) => (
          <List.Item>
            <Row>
              <Row>{item.class}</Row>
              <Row>
                {item.name}{' '}
                <Typography.Text type='secondary'>{item.time}</Typography.Text>
              </Row>
            </Row>
          </List.Item>
        )}
      />
    </Col>
  );
};
const generateStartDateItems = (
  setDateItems: Dispatch<SetStateAction<JSX.Element[]>>
) => {
  const startDate = moment(Date.now()).startOf('isoWeek').format(DATE_FORMAT)
  let items: JSX.Element[] = [];

  for (let i = 0; i < 7; i++) {
    items.push(
      genetateDateItem(startDate, i, schedule)
    );
  }
  setDateItems(items);
};

const Main = (props: Props) => {
  const [dateItems, setDateItems] = useState<JSX.Element[]>([]);

  useEffect(() => {
    generateStartDateItems(setDateItems);
  }, []);

  return (
    <div>
      <Row justify='space-around'>{dateItems}</Row>
    </div>
  );
};

export default Main;
