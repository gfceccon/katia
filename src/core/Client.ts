import { AppointmentDate } from "./Appointment.js";

export interface Client {
  id: string;
  name: string;
  number: string;
  appointments: AppointmentDate[];
}