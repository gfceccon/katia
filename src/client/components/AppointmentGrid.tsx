import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { AppointmentsRow } from "../hooks/context/appointmentsHook";
import { Appointment } from "../../core/Appointment";
import { Box, Button, Typography } from "@mui/material";
import { Employee } from "../../core/Employee";
import AppointmentGridCellItem from "./AppointmentGridCellItem";
import AppointmentGridSchedule from "./AppointmentGridSchedule";

interface AppointmentGridProps {
  rows: AppointmentsRow[];
  employee?: Employee;
  openModal: (
    time: number,
    employee: Employee | undefined,
    appointment: Appointment | undefined,
    readonly: boolean
  ) => void;
  home: boolean;
}

const AppointmentGrid = (props: AppointmentGridProps) => {


  const columns: GridColDef[] = [
    {
      field: "timeStamp",
      headerName: "Hora",
    },
    {
      field: "appointments",
      headerName: "Serviços",
      flex: 1,
      minWidth: 800,
      renderCell: (
        cellProps: GridRenderCellParams<AppointmentsRow, Appointment[]>
      ) => {
        return (
          <Box>
            {cellProps.value?.map((appointment) => (
              <AppointmentGridCellItem
                appointment={appointment}
                home={props.home}
                openModal={props.openModal}
                key={appointment.id}
              ></AppointmentGridCellItem>
            ))}
            {!props.home && (
              <AppointmentGridSchedule
                employee={props.employee}
                openModal={props.openModal}
                row={cellProps.row}
              ></AppointmentGridSchedule>
            )}
          </Box>
        );
      },
    },
  ];

  return (
    <DataGrid
      getRowId={(appointments: AppointmentsRow) => appointments.unixTime}
      rows={props.rows}
      columns={columns}
    ></DataGrid>
  );
};

export default AppointmentGrid;
