import {
  AutoComplete,
  Button,
  DatePicker,
  Modal,
  Row,
  Select,
  TimePicker,
  Typography,
} from 'antd';
import { BaseOptionType, OptionProps } from 'antd/lib/select';
import moment from 'moment';
import { FieldNames } from 'rc-select/lib/Select';
import React, { useEffect, useState } from 'react';
import { DATE_FORMAT } from '../consts';
import { CreateLessonDTO, GroupDTO, SubjectDTO } from '../dto';

type Props = {
  data: CreateLessonDTO;
  id: number | null;
  visible: boolean;
  closeModal: () => void;
  createLesson: (lesson: CreateLessonDTO) => void;
  deleteLesson: (id: number) => void;
  changeLesson: (id: number, lesson: CreateLessonDTO) => void;
  lessons: any[];
  groups: any[];
  classrooms: any[];
};
const { Option } = AutoComplete;

const CreateLessonModal = ({
  data,
  id,
  visible,
  closeModal,
  createLesson,
  deleteLesson,
  changeLesson,
  lessons,
  groups,
  classrooms,
}: Props) => {
  const [lesson, setLesson] = useState<CreateLessonDTO>({});

  useEffect(() => {
    setLesson(data);
  }, [data]);

  const validateFields = () => {
    if (
      [
        lesson.classroom_id,
        lesson.date,
        lesson.end_time,
        lesson.group_id,
        lesson.start_time,
        lesson.subject_id,
      ].includes(undefined)
    ) {
      return false;
    }
    return true;
  };

  return (
    <Modal
      visible={visible}
      onCancel={closeModal}
      maskClosable={false}
      footer={
        <div>
          {id && (
            <Button
              onClick={() => {
                deleteLesson(id);
                setLesson({});
                closeModal();
              }}
              danger
            >
              Удалить
            </Button>
          )}
          <Button
            onClick={() => {
              if (validateFields()) {
                !id ? createLesson(lesson) : changeLesson(id, lesson);
                setLesson({});
                closeModal();
              }
            }}
          >
            {id ? 'Изменить' : 'Добавить'}
          </Button>
        </div>
      }
      title='Добавление урока'
    >
      <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
        <Row>
          <Typography.Text>Выберите класс &nbsp;</Typography.Text>
          <Select
            style={{ width: '100px' }}
            options={groups}
            value={lesson.group_id}
            onChange={(el) => setLesson({ ...lesson, group_id: el })}
          ></Select>
        </Row>
        <Row>
          <Typography.Text>Выберите кабинет &nbsp;</Typography.Text>
          <Select
            style={{ width: '150px' }}
            options={classrooms}
            value={lesson.classroom_id}
            onChange={(el) => setLesson({ ...lesson, classroom_id: el })}
          ></Select>
        </Row>
        <Row>
          <Typography.Text>Выберите урок &nbsp;</Typography.Text>
          <Select
            style={{ width: '150px' }}
            options={lessons}
            value={lesson.subject_id}
            onChange={(el) => setLesson({ ...lesson, subject_id: el })}
          ></Select>
        </Row>
        <Row>
          <Typography.Text>Выберите дату &nbsp;</Typography.Text>
          <DatePicker
            placeholder='Дата занятия'
            value={lesson.date ? moment(lesson.date, DATE_FORMAT) : undefined}
            format={DATE_FORMAT}
            onChange={(el) =>
              setLesson({ ...lesson, date: el ? el?.format(DATE_FORMAT) : '' })
            }
          ></DatePicker>
        </Row>
        <Row>
          <Typography.Text>Выберите время &nbsp;</Typography.Text>
          <TimePicker.RangePicker
            format={'HH:mm'}
            minuteStep={5}
            placeholder={['Начало урока', 'Конец урока']}
            value={
              lesson.start_time
                ? [
                    moment(lesson.start_time, 'HH:mm'),
                    moment(lesson.end_time, 'HH:mm'),
                  ]
                : undefined
            }
            onChange={(el) =>
              setLesson({
                ...lesson,
                start_time: el?.[0]?.format('HH:mm'),
                end_time: el?.[1]?.format('HH:mm'),
              })
            }
          ></TimePicker.RangePicker>
        </Row>
      </div>
    </Modal>
  );
};

export default CreateLessonModal;
