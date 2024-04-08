import { createBrowserRouter } from "react-router-dom";
import { Layout } from "../Layout";
import { layoutLoader } from "./LayoutRouter";
import { homeLoader } from "./HomeRouter";
import HomePage from "../pages/HomePage";
import { employeeLoader } from "./EmployeeRouter";
import EmployeePage from "../pages/EmployeePage";
import AppointmentPage from "../pages/AppointmentsPage";
import ServicePage from "../pages/ServicePage";
import ClientPage from "../pages/ClientPage";
import { appointmentLoader } from "./AppointmentRouter";
import { serviceLoader } from "./ServiceRouter";
import { clientLoader } from "./ClientRouter";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    loader: layoutLoader,
    children: [
      {
        index: true,
        loader: homeLoader,
        Component: HomePage,
      },
      {
        path: "employee",
        loader: layoutLoader,
        children: [
          {
            index: true,
            loader: employeeLoader,
            Component: EmployeePage,
          },
          {
            path: ":id",
            loader: appointmentLoader,
            Component: AppointmentPage,
          },
        ],
      },
      {
        path: "service",
        loader: serviceLoader,
        Component: ServicePage,
      },
      {
        path: "client",
        loader: clientLoader,
        Component: ClientPage,
      },
    ],
  },
]);
