import { Box, Button, Typography } from "@mui/material";
import { Appointment } from "../../core/Appointment";
import { Employee } from "../../core/Employee";

interface AppointmentGridCellItemProps {
  appointment: Appointment;
  home: boolean;
  openModal: (
    time: number,
    employee: Employee | undefined,
    appointment: Appointment | undefined,
    readonly: boolean
  ) => void;
}

const AppointmentGridCellItem = (props: AppointmentGridCellItemProps) => {
  return (
    <Button
      color="primary"
      key={props.appointment.id}
      onClick={() =>
        props.openModal(
          props.appointment.time,
          props.appointment.employee,
          props.appointment,
          true
        )
      }
    >
      <Box bgcolor={"transparent"} borderRadius={2} border={1}>
        <Typography key={props.appointment.id} margin={1} fontWeight={500}>
          {props.home
            ? `${props.appointment.employee.name} - ${props.appointment.client.name} - ${props.appointment.service.name}`
            : `${props.appointment.client.name} - ${props.appointment.service.name}`}
        </Typography>
      </Box>
    </Button>
  );
};

export default AppointmentGridCellItem;
