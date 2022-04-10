export type Schedule = {
  id: number;
  classRoom: ClassRoom;
  subject: Subject;
  date: string;
  startTime: string;
  endTime: string;
};

export type ClassRoom = {
  id: number;
  name: string;
};

export type Subject = {
  id: number;
  name: string;
};

export type Group = {
  id: number;
  name: string;
};
