import axios from "axios";
import { Client } from "../../core/Client";
import { Employee } from "../../core/Employee";
import { Service } from "../../core/Service";
import { Appointment } from "../../core/Appointment";
import dayjs from "dayjs";

export interface HomeLoaderType {
  appointments: Appointment[];
  employees: Employee[];
  clients: Client[];
  services: Service[];
}

export async function homeLoader(): Promise<HomeLoaderType> {
  const date = dayjs().format("YYYY-MM-DD");
  const appointmentsAxios = await axios.get<Appointment[]>(
    `/api/appointment/date/${date}`
  );
  const employeeAxios = await axios.get<Employee[]>(`/api/employee`);
  const clientsAxios = await axios.get<Client[]>(`/api/client`);
  const servicesAxios = await axios.get<Service[]>(`/api/service`);

  return {
    appointments: appointmentsAxios.data,
    employees: employeeAxios.data,
    clients: clientsAxios.data,
    services: servicesAxios.data,
  };
}
