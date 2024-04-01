import { Low } from "lowdb";
import { loadDatabase } from "./Database.js";
import { Service } from "../../core/Service.js";


export namespace ServiceDatabase {
  const fileName = "services.json";
  
  export type Type = {
    services: Service[];
  };

  export const load = async (): Promise<Low<Type>> =>
    loadDatabase<Type>(fileName, { services: [] });
}
