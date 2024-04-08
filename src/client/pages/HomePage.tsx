import { FunctionComponent } from "react";
import AppointmentGrid from "../components/AppointmentGrid";
import { useLoaderData } from "react-router-dom";
import { HomeLoaderType } from "../router/HomeRouter";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/pt-br";
import {
  AppointmentContext,
  createAppointmentHook,
} from "../hooks/context/appointmentsHook";
import dayjs from "dayjs";
import { Box } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";

interface HomePageProps {}

const HomePage = (props: HomePageProps) => {
  const { appointments, clients, employees, services } =
    useLoaderData() as HomeLoaderType;

  const hook = createAppointmentHook(true, undefined);

  return (
    <AppointmentContext.Provider
      value={{
        date: dayjs(),
        employee: undefined,
        setDate: hook.setDate,
      }}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
        <Box sx={{ py: 10 }}></Box>
        <DatePicker
          format="DD-MM-YYYY"
          onChange={(v) => {
            hook.appointmentsCallback(v || dayjs(), true, undefined);
          }}
          value={hook.date}
        ></DatePicker>
        <AppointmentGrid
          home={true}
          openModal={(time, employee, appointment, readonly) => {}}
          rows={hook.rows}
        ></AppointmentGrid>
      </LocalizationProvider>
    </AppointmentContext.Provider>
  );
};

export default HomePage;
