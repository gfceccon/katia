import {
  Box,
  CssBaseline,
  PaletteMode,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import React from "react";
import { Outlet, useLoaderData } from "react-router-dom";
import { Employee } from "../core/Employee";
import EmployeeAppBar from "./components/EmployeeAppBar";

export function Layout() {
  const [mode, _] = React.useState<PaletteMode>("light");
  const defaultTheme = createTheme({ palette: { mode } });
  let employees = useLoaderData() as Employee[];

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <EmployeeAppBar employees={employees}></EmployeeAppBar>
      <Box sx={{ bgcolor: "background.default" }}>
        <Outlet></Outlet>
      </Box>
    </ThemeProvider>
  );
}
