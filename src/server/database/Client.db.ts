import { Client } from "../../core/Client.js";
import { Appointment } from "../../core/Appointment.js";
import { Low } from "lowdb";
import { loadDatabase } from "./Database.js";


export namespace ClientDatabase {
  const fileName = "clients.json";
  
  export type Type = {
    clients: Client[];
  };

  export const load = async (): Promise<Low<Type>> =>
    loadDatabase<Type>(fileName, { clients: [] });

  export const getClientHistory = (client: Client): Appointment[] => {
    throw new Error("Not Implemented getClientHistory");
  };
}
