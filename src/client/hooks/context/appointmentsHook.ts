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
import { Client } from "../../../core/Client.js";
import { Service } from "../../../core/Service.js";

const startHour = 7;
const endHour = 18;
const startMinute = 30;
const endMinute = 30;
const slots = (endHour - startHour) * 2;

export type AppointmentContextType = {
  date: Dayjs;
  unixTime: number | undefined;
  appointment: Appointment | undefined;
  employee: Employee | undefined;
  client: Client | undefined;
  service: Service | undefined;
  readonly: boolean;
  appointmentsCallback: (date: Dayjs, home: boolean, employee: Employee | undefined) => void;
  openModal: (appointment: Appointment) => void;
};

export const AppointmentContext = createContext<AppointmentContextType>({
  date: dayjs(),
  unixTime: undefined,
  appointment: undefined,
  employee: undefined,
  client: undefined,
  service: undefined,
  readonly: false,
  appointmentsCallback: () => {},
  openModal: () => {}
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

export const createAppointmentHook = (props: {
  employee: Employee | undefined;
}) => {
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

  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState(defaultRows);
  const [date, setDate] = useState<Dayjs>(dayjs());
  const [appointment, setAppointment] = useState<Appointment | undefined>();
  const [client, setClient] = useState<Client | undefined>();
  const [service, setService] = useState<Service | undefined>();
  const [employee, setEmployee] = useState<Employee | undefined>(
    props.employee
  );

  const appointmentsCallback = useCallback(
    (date: Dayjs, home: boolean) => {
      const getAppointments = home
        ? axios.get<Appointment[]>(
            `/api/appointment/date/${date.format("YYYY-MM-DD")}`
          )
        : axios.get<Appointment[]>(
            `/api/appointment/date/${date.format("YYYY-MM-DD")}/employee/${
              employee?.id
            }`
          );
      getAppointments.then((results) => {
        if (results.status == 200) {
          const rows = getRows(date, results.data);
          setRows(rows);
          setDate(date);
        }
      });
    },
    []
  );

  const openModal = useCallback((appointment: Appointment) => {
    if(!open) {
      setAppointment(appointment);
      setClient(appointment.client);
      setService(appointment.service);
      setOpen(true);
    }
  }, []);

  const appointmentMemo = useMemo<AppointmentContextType>(
    () => ({
      date: date,
      unixTime: undefined,
      appointment,
      employee,
      client,
      service,
      readonly: false,
      appointmentsCallback,
      openModal
    }),
    [date, appointment, employee, client, appointmentsCallback, openModal]
  );

  return { appointmentMemo, rows };
};

const getRows = (
  date: Dayjs,
  appointments: Appointment[]
): AppointmentsRow[] => {
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

  return rows;
};
