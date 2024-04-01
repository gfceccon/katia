import { Low } from "lowdb";
import { loadDatabase } from "./Database.js";
import { Appointment } from "../../core/Appointment.js";

export namespace AppointmentDatabase {
  export type Type = {
    appointments: Appointment[];
  };

  export const load = async (
    date: string
  ): Promise<Low<Type>> =>
    loadDatabase<Type>(date, { appointments: [] });
}
