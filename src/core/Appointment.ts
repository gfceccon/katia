import { exists } from "../server/database/Database.js";
import { Client } from "./Client.js";
import { Employee } from "./Employee.js";
import { Service } from "./Service.js";

export interface Appointment {
  id: string;
  time: number;
  service: Service;
  employee: Employee;
  client: Client;
}

export interface AppointmentDate {
  date: string
}

export const getAppointmentFiles = (user: Employee | Client): string[] => {
  const appointments = Array.from(
    new Set(
      user.appointments.map((appointment) => `${appointment.date}.json`)
    )
  );
  return appointments.filter((file) => exists(file));
};