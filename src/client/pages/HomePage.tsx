import { FunctionComponent, useState } from "react";
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
import { Box, Grid, InputLabel, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { Client } from "../../core/Client";
import { Employee } from "../../core/Employee";
import { stringify } from "querystring";

interface HomePageProps {}

const HomePage = (props: HomePageProps) => {
  const { appointments, clients, employees, services } =
    useLoaderData() as HomeLoaderType;

  const hook = createAppointmentHook({ employee: undefined });

  return (
    <AppointmentContext.Provider value={hook.appointmentMemo}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
        <Box sx={{ py: 10 }}></Box>
        <Grid container sx={{ py: 4 }} alignItems={"space-around"}>
          <Grid xs={3} md={3} sm={3} item>
            <Box></Box>
          </Grid>
          <Grid
            xs={2}
            md={2}
            sm={2}
            display={"flex"}
            alignItems={"center"}
            flexDirection={"row-reverse"}
            item
          >
            <Typography fontSize={24}>
              Data {hook.appointmentMemo.date.format()}{" "}
              {JSON.stringify(hook.appointmentMemo.appointment)}
            </Typography>
          </Grid>
          <Grid xs={4} md={4} sm={4} item>
            <DatePicker
              format="DD-MM-YYYY"
              onChange={(v) => {
                hook.appointmentMemo.appointmentsCallback(
                  v || dayjs(),
                  true,
                  undefined
                );
              }}
              value={hook.appointmentMemo.date}
            ></DatePicker>
          </Grid>
          <Grid xs={3} md={3} sm={3} item>
            <Box></Box>
          </Grid>
        </Grid>
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
