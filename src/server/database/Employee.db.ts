import { Low } from "lowdb";
import { loadDatabase } from "./Database.js";
import { Employee } from "../../core/Employee.js";

export namespace EmployeeDatabase {
  const fileName = "employees.json";

  export type Type = {
    employees: Employee[];
  };

  export const load = async (): Promise<Low<Type>> =>
    loadDatabase<Type>(fileName, { employees: [] });
}
