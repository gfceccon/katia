import {
  Dispatch,
  SetStateAction,
  createContext,
  memo,
  useReducer,
} from "react";
import { Appointment } from "../../../core/Appointment.js";
import dayjs, { Dayjs } from "dayjs";
import { useCallback, useMemo, useState } from "react";
import axios from "axios";
import { Employee } from "../../../core/Employee.js";

const startHour = 7;
const endHour = 18;
const startMinute = 30;
const endMinute = 30;
const slots = (endHour - startHour) * 2;

export type AppointmentContextType = {
  date: Dayjs;
  setDate: Dispatch<SetStateAction<Dayjs>> | undefined;
  employee: Employee | undefined;
};

export const AppointmentContext = createContext<AppointmentContextType>({
  date: dayjs(),
  setDate: undefined,
  employee: undefined,
});

export interface AppointmentsRow {
  unixTime: number;
  timeStamp: string;
  appointments: Appointment[];
}

type AppointmentAux = {
  [time: string]: { unixTime: number; appointments: Appointment[] };
};

const createAppointmentAux = (date: Dayjs): AppointmentAux => {
  let timeAppointment: AppointmentAux = {};
  for (
    let index = 0 + startMinute / 30;
    index < slots - endMinute / 30;
    index++
  ) {
    const minute = index % 2;
    const hour = (index - minute) / 2 + startHour;
    const time = date
      .hour(hour)
      .minute(minute * 30)
      .unix();
    const timeStamp = date
      .hour(hour)
      .minute(minute * 30)
      .format("HH:mm");
    timeAppointment[timeStamp] = { unixTime: time, appointments: [] };
  }
  return timeAppointment;
};

export const createAppointmentHook = (
  home: boolean,
  employee: Employee | undefined
) => {
  let timeAppointment: AppointmentAux = createAppointmentAux(dayjs());
  const defaultRows: AppointmentsRow[] = [];

  Object.keys(timeAppointment).forEach((timeStamp) => {
    const unixTime = timeAppointment[timeStamp].unixTime;
    const appointments = timeAppointment[timeStamp].appointments;
    defaultRows.push({
      unixTime: unixTime,
      timeStamp: timeStamp,
      appointments: appointments,
    });
  });

  const [rows, setRows] = useState(defaultRows);
  const [date, setDate] = useState<Dayjs>(dayjs());

  const appointmentsCallback = useCallback(
    (date: Dayjs, home: boolean, employee: Employee | undefined) => {
      const getAppointments = home
        ? axios.get<Appointment[]>(
            `/api/appointment/date/${date.format("YYYY-MM-DD")}`
          )
        : axios.get<Appointment[]>(
            `/api/appointment/date/${date.format("YYYY-MM-DD")}/employee/${employee?.id}`
          );
      getAppointments.then((results) => {
        if (results.status == 200) {
          setAppointments(date, setRows, results.data);
          setDate(date);
        }
      });
    },
    [date, home, employee]
  );

  return { date, rows, setDate, appointmentsCallback };
};

const setAppointments = (
  date: Dayjs,
  setRows: Dispatch<SetStateAction<AppointmentsRow[]>>,
  appointments: Appointment[]
) => {
  let timeAppointment: AppointmentAux = createAppointmentAux(date);
  const rows: AppointmentsRow[] = [];

  appointments.forEach((appointment) => {
    const date = dayjs.unix(appointment.time);
    const time = date.format("HH:mm");
    timeAppointment[time].appointments.push(appointment);
  });

  Object.keys(timeAppointment).forEach((time) => {
    const unixTime = timeAppointment[time].unixTime;
    const appointments = timeAppointment[time].appointments;
    rows.push({
      unixTime: unixTime,
      timeStamp: time,
      appointments: appointments,
    });
  });

  setRows(rows);
};
