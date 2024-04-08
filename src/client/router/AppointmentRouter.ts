import axios from "axios";
import { Client } from "../../core/Client";
import { Employee } from "../../core/Employee";
import { Service } from "../../core/Service";
import { Appointment } from "../../core/Appointment";
import dayjs from "dayjs";
import { LoaderFunctionArgs } from "react-router-dom";

export interface AppointmentLoaderType {
  appointments: Appointment[];
  employee: Employee;
  clients: Client[];
  services: Service[];
}

export async function appointmentLoader({
  params,
}: LoaderFunctionArgs): Promise<AppointmentLoaderType> {
  if (!params.id) {
    throw new Error("Expected params.id");
  }

  const date = dayjs().format("YYYY-MM-DD");
  const appointmentsAxios = await axios.get<Appointment[]>(
    `/api/appointment/date/${date}/employee/${params.id}`
  );
  const employeeAxios = await axios.get<Employee>(`/api/employee/${params.id}`);
  const clientsAxios = await axios.get<Client[]>(`/api/client`);
  const servicesAxios = await axios.get<Service[]>(`/api/service`);

  return {
    appointments: appointmentsAxios.data,
    employee: employeeAxios.data,
    clients: clientsAxios.data,
    services: servicesAxios.data,
  };
}
