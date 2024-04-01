import { AppointmentDate } from "./Appointment.js";

export interface Employee {
  id: string;
  name: string;
  appointments: AppointmentDate[];
}