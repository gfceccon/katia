import { Box, Button, Typography } from "@mui/material";
import { Appointment } from "../../core/Appointment";
import { Employee } from "../../core/Employee";
import { GridCellParams } from "@mui/x-data-grid";
import { AppointmentsRow } from "../hooks/context/appointmentsHook";

interface AppointmentGridScheduleProps {
  employee: Employee | undefined;
  row:  AppointmentsRow
  openModal: (
    time: number,
    employee: Employee | undefined,
    appointment: Appointment | undefined,
    readonly: boolean
  ) => void;
}

const AppointmentGridSchedule = (props: AppointmentGridScheduleProps) => {
  return (
    <Button
      color={"secondary"}
      onClick={() =>
        props.openModal(
          props.row.unixTime,
          props.employee,
          undefined,
          false
        )
      }
    >
      <Box
        bgcolor={"transparent"}
        borderRadius={"100%"}
        border={1}
        width={50}
        height={50}
      >
        <Typography
          margin={1}
          fontWeight={500}
          fontSize={20}
          align="center"
        >
          +
        </Typography>
      </Box>
    </Button>
  );
};

export default AppointmentGridSchedule;
