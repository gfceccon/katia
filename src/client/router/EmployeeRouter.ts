import axios from "axios";
import { Client } from "../../core/Client";
import { Employee } from "../../core/Employee";
import { Service } from "../../core/Service";
import { Appointment } from "../../core/Appointment";
import { LoaderFunctionArgs } from "react-router-dom";
import dayjs from "dayjs";

export interface EmployeeLoaderType {
  employees: Employee[];
  clients: Client[];
  services: Service[];
}


export async function employeeLoader(): Promise<EmployeeLoaderType> {
  const employeeAxios = await axios.get<Employee[]>(`/api/employee`);
  const clientsAxios = await axios.get<Client[]>(`/api/client`);
  const servicesAxios = await axios.get<Service[]>(`/api/service`);

  return {
    employees: employeeAxios.data,
    clients: clientsAxios.data,
    services: servicesAxios.data,
  };
}
