import { Button, Card, Col, Divider, List, Row, Typography } from 'antd';
import moment from 'moment';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import CreateLessonModal from '../components/CreateLessonModal';
import { DATE_FORMAT } from '../consts';
import {
  ClassroomDTO,
  CreateLessonDTO,
  GroupDTO,
  ScheduleAssignationDTO,
  ScheduleDTO,
  SubjectDTO,
} from '../dto';
import { FieldNames } from 'rc-select/lib/Select';
import {
  changeLesson,
  createLesson,
  deleteLesson,
  getClassrooms,
  getGroups,
  getSchedules,
  getSchedulesAssignations,
  getSubject,
} from '../api';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

type Props = {};

const genetateDateItem = (
  dateNow: string,
  handleModalOpen: (
    id?: number,
    data?: {
      class?: ClassroomDTO;
      subject?: SubjectDTO;
      time?: string;
      group?: (GroupDTO | undefined)[];
      date?: string;
    }
  ) => void,
  i: number,
  sсhedule: ScheduleDTO[],
  classrooms: ClassroomDTO[],
  subjects: SubjectDTO[],
  groups: GroupDTO[],
  scheduleAssignations: ScheduleAssignationDTO[]
) => {
  const date = moment(dateNow, DATE_FORMAT).add(i, 'days').format(DATE_FORMAT);
  const lessons: {
    id: number;
    class?: ClassroomDTO;
    subject?: SubjectDTO;
    time?: string;
    group?: (GroupDTO | undefined)[];
  }[] = sсhedule
    .filter((el) => moment(el.date).format(DATE_FORMAT) === date)
    .map((el) => ({
      id: el.id,
      class: classrooms.find((classroom) => classroom.id === el.classroom_id),
      subject: subjects.find((subject) => subject.id === el.subject_id),
      time: el.start_time + '-' + el.end_time,
      group: scheduleAssignations.map((_el) =>
        _el.schedule_id === el.id
          ? groups.find((gr) => _el.group_id === gr.id)
          : undefined
      ),
    }));

  return (
    <Col span={3}>
      <List
        className={
          date === moment(Date.now()).format(DATE_FORMAT) ? 'today' : ''
        }
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
          <List.Item
            onClick={() => handleModalOpen(item.id, { ...item, date })}
            className='listItem'
          >
            <Row key={i}>
              <Col flex='1 0 100%'>
                {item.group?.map((el) => el?.name).join(' ')} {item.class?.name}
              </Col>
              <Col flex='1 0 100%'>{item.subject?.name}</Col>
              <Col>
                <Typography.Text type='secondary'>{item.time}</Typography.Text>
              </Col>
            </Row>
          </List.Item>
        )}
      />
    </Col>
  );
};
const generateStartDateItems = (
  offset: number,
  setDateItems: Dispatch<SetStateAction<JSX.Element[]>>,
  handleModalOpen: (
    id?: number,
    data?: {
      class?: ClassroomDTO;
      subject?: SubjectDTO;
      time?: string;
      group?: (GroupDTO | undefined)[];
      date?: string;
    }
  ) => void,
  schedule: ScheduleDTO[],
  subjects: SubjectDTO[],
  classrooms: ClassroomDTO[],
  groups: GroupDTO[],
  scheduleAss: ScheduleAssignationDTO[]
) => {
  const startDate = moment(Date.now())
    .startOf('isoWeek')
    .add(offset, 'w')
    .format(DATE_FORMAT);
  let items: JSX.Element[] = [];

  for (let i = 0; i < 7; i++) {
    items.push(
      genetateDateItem(
        startDate,
        handleModalOpen,
        i,
        schedule,
        classrooms,
        subjects,
        groups,
        scheduleAss
      )
    );
  }
  setDateItems(items);
};

const Main = (props: Props) => {
  const [dateItems, setDateItems] = useState<JSX.Element[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [modalData, setModalData] = useState<Partial<CreateLessonDTO>>({});
  const [id, setId] = useState<number | null>(null);
  const [offset, setOffset] = useState<number>(0);

  const [groups, setGroups] = useState<GroupDTO[]>([]);
  const [classrooms, setClassrooms] = useState<ClassroomDTO[]>([]);
  const [subject, setSubject] = useState<SubjectDTO[]>([]);
  const [schedules, setSchedules] = useState<ScheduleDTO[]>([]);
  const [schedulesAssignations, setSchedulesAssignations] = useState<
    ScheduleAssignationDTO[]
  >([]);

  const closeModal = () => setOpenModal(false);
  const createSubject = (lesson: CreateLessonDTO) => {
    createLesson(lesson).then((_) => {
      getSchedules().then((res) => setSchedules(res.data));
      getSchedulesAssignations().then((res) =>
        setSchedulesAssignations(res.data)
      );
    });
  };
  const changeSubject = (id: number, lesson: CreateLessonDTO) => {
    changeLesson(id, lesson).then((_) => {
      getSchedules().then((res) => setSchedules(res.data));
      getSchedulesAssignations().then((res) =>
        setSchedulesAssignations(res.data)
      );
    });
  };
  const deleteSubject = (id: number) => {
    deleteLesson(id).then((_) => {
      getSchedules().then((res) => setSchedules(res.data));
      getSchedulesAssignations().then((res) =>
        setSchedulesAssignations(res.data)
      );
    });
  };
  useEffect(() => {
    getGroups().then((res) => setGroups(res.data));
    getClassrooms().then((res) => setClassrooms(res.data));
    getSubject().then((res) => setSubject(res.data));
    getSchedules().then((res) => setSchedules(res.data));
    getSchedulesAssignations().then((res) =>
      setSchedulesAssignations(res.data)
    );
  }, []);

  useEffect(() => {
    console.log('regenerate');

    generateStartDateItems(
      offset,
      setDateItems,
      handleModalOpen,
      schedules,
      subject,
      classrooms,
      groups,
      schedulesAssignations
    );
  }, [offset, classrooms, groups, schedules, schedulesAssignations, subject]);

  const groupsOptions: any[] = groups.map((el) => ({
    label: el.name,
    value: el.id,
  }));
  const classroomOptions: any[] = classrooms.map((el) => ({
    label: el.name,
    value: el.id,
  }));
  const subjectOptions: any[] = subject.map((el) => ({
    label: el.name,
    value: el.id,
  }));

  const handleModalOpen = (
    id?: number,
    data?: {
      class?: ClassroomDTO;
      subject?: SubjectDTO;
      time?: string;
      group?: (GroupDTO | undefined)[];
      date?: string;
    }
  ) => {
    if (id) {
      setId(id);
      console.log(data);

      setModalData({
        start_time: data?.time?.split('-')[0],
        end_time: data?.time?.split('-')[1],
        subject_id: data?.subject?.id,
        classroom_id: data?.class?.id,
        group_id: data?.group?.map((el) => el?.name).join(' '),
        date: data?.date,
      });
    } else {
      setId(null);
      setModalData({});
    }

    setOpenModal(true);
  };

  return (
    <div>
      <Row justify='end' style={{ marginBottom: '10px' }}>
        <Col pull={1}>
          <Button onClick={() => handleModalOpen()}>Добавить урок</Button>
        </Col>
      </Row>
      <Row justify='space-around' align='middle'>
        <Col span={1}>
          <Button onClick={_=> setOffset(offset - 1)} icon shape='circle' size='large'>
            <LeftOutlined />
          </Button>
        </Col>
        <Col span={22}>
          <Row justify='space-around'>{dateItems}</Row>
        </Col>
        <Col span={1} style={{ display: 'flex', justifyContent: 'end' }}>
          <Button onClick={_=> setOffset(offset + 1)} icon shape='circle' size='large'>
            <RightOutlined />
          </Button>
        </Col>
      </Row>

      <CreateLessonModal
        data={modalData}
        id={id}
        visible={openModal}
        closeModal={closeModal}
        createLesson={createSubject}
        deleteLesson={deleteSubject}
        changeLesson={changeSubject}
        groups={groupsOptions}
        lessons={subjectOptions}
        classrooms={classroomOptions}
      />
    </div>
  );
};

export default Main;
