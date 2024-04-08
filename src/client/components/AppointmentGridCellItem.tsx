import { Box, Button, Typography } from "@mui/material";
import { Appointment } from "../../core/Appointment";
import { Employee } from "../../core/Employee";
import { useContext } from "react";
import { AppointmentContext } from "../hooks/context/appointmentsHook";

interface AppointmentGridCellItemProps {
  appointment: Appointment;
  home: boolean;
}
const AppointmentGridCellItem = (props: AppointmentGridCellItemProps) => {
  const context = useContext(AppointmentContext);
  const openModal = () => {
    // props.appointment.time,
    // props.appointment.employee,
    // props.appointment,
    //true
    context.appointment = props.appointment;
    console.log(context.appointment);
  }

  return (
    <Button
      color="primary"
      key={props.appointment.id}
      onClick={openModal}
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
