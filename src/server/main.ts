import bodyParser from "body-parser";
import express from "express";
import ViteExpress from "vite-express";
import { AppointmentApi } from "./api/Appointment.api.js";
import { ClientApi } from "./api/Client.api.js";
import { EmployeeApi } from "./api/Employee.api.js";
import { ServiceApi } from "./api/Service.api.js";

const app = express();
const jsonParser = bodyParser.json();
app.use(jsonParser);

app.use("/api/appointment", AppointmentApi.router());
app.use("/api/client", ClientApi.router());
app.use("/api/employee", EmployeeApi.router());
app.use("/api/service", ServiceApi.router());

ViteExpress.listen(app, 80, () =>
  console.log("Server is listening on http://localhost")
);
