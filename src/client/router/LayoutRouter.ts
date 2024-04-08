import { Employee } from "../../core/Employee";
import axios from "axios"

export async function layoutLoader(): Promise<Employee[]> {
  const employeeAxios = await axios.get<Employee[]>("/api/employee");
  if (employeeAxios.status == 200) return employeeAxios.data;
  else throw {error: "Employees loading error"};
}