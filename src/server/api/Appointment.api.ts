import express, { Router, Request, Response } from "express";
import { Appointment } from "../../core/Appointment.js";
import { AppointmentDatabase } from "../database/Appointment.db.js";
import { existsSync } from "fs";
import { Low } from "lowdb";
import { EmployeeApi } from "./Employee.api.js";
import { ClientApi } from "./Client.api.js";
import { ServiceApi } from "./Service.api.js";

export namespace AppointmentApi {
  export const router = (): Router => {
    const router = express.Router();

    router.get("/date/:date", async (req, res) => {
      const date = req.params.date;

      if (!validateDate(date, res)) return;

      const db = await getDatabase(date, res);

      if (db) {
        res.status(200).json(db.data.appointments).end();
      }
    });

    router.post("/date/:date", async (req, res) => {
      const date = req.params.date;

      if (!validateDate(date, res)) return;

      const appointment = await validate(req.body, res);

      if (!appointment) return;

      const appointments = await getDatabase(date, res);

      const employees = await EmployeeApi.database;
      const clients = await ClientApi.database;

      employees.update(({ employees }) => {
        const employee = employees.find((e) => e.id == appointment.employee.id);
        employee?.appointments.push({ date });
      });

      clients.update(({ clients }) => {
        const client = clients.find((e) => e.id == appointment.client.id);
        client?.appointments.push({ date });
      });

      if (appointments) {
        await appointments.update(({ appointments }) =>
          appointments.push(appointment)
        );
        res.status(200).json(appointments.data.appointments).end();
      }
    });

    router.delete("/:id/date/:date", async (req, res) => {
      const id = req.params.id;
      const date = req.params.date;

      if (!id) {
        res.status(500).json({ error: "Id not specified" }).end();
        return;
      }

      if (!validateDate(date, res)) return;

      const appointment = await validate(req.body, res);

      if (!appointment) return;

      const appointments = await getDatabase(date, res);

      if (appointments) {
        const index = appointments.data.appointments.findIndex(
          (_appointment) => _appointment.id == id
        );

        if (index < 0) {
          res.status(404).json({ error: "Appointment not found" }).end();
        } else {
          await appointments.update(({ appointments }) => {
            appointments.splice(index, 1);
          });
          res.status(200).json(appointments.data.appointments).end();
        }
      }
    });

    router.get("/date/:date/employee/:id", async (req, res) => {
      const id = req.params.id;
      const date = req.params.date;

      if (!id) {
        res.status(500).json({ error: "Id not specified" }).end();
        return;
      }

      if (!date) {
        res.status(500).json({ error: "Date not specified" }).end();
        return;
      }

      if (!validateDate(date, res)) return;

      const db = await getDatabase(date, res);

      if (!db) {
        res.status(500).json({ error: "Database error" }).end();
        return;
      }

      const appointments = db.data.appointments.filter(
        (appointment) => appointment.employee.id == id
      );
      res.status(200).json(appointments).end();
    });

    return router;
  };

  export const validateDate = (date: string, res: Response): boolean => {
    if (!date) {
      res.status(500).json({ error: "Date not specified" }).end();
      return false;
    }

    if (!date.trim().match(/^\d{4}-\d{2}-\d{2}$/)) {
      res.status(500).json({ error: "Date is invalid" }).end();
      return false;
    }
    
    return true;
  };

  export const validate = async (
    body: any,
    res: Response
  ): Promise<Appointment | undefined> => {
    const appointment = body as Appointment;
    const client = ClientApi.validate(appointment.client, res);
    const employee = EmployeeApi.validate(appointment.employee, res);
    const service = ServiceApi.validate(appointment.service, res);
    if (!client || !employee || !service) return;
    const employees = await EmployeeApi.database;
    const clients = await ClientApi.database;
    const services = await ServiceApi.database;
    if (employees.data.employees.findIndex((e) => e.id == employee.id) < 0) {
      res.status(404).json({ error: "Employee not found" });
      return;
    }
    if (clients.data.clients.findIndex((c) => c.id == client.id) < 0) {
      res.status(404).json({ error: "Client not found" });
      return;
    }
    if (services.data.services.findIndex((s) => s.id == service.id) < 0) {
      res.status(404).json({ error: "Service not found" });
      return;
    }

    return appointment;
  };

  export const getDatabase = async (
    date: string,
    res: Response
  ): Promise<Low<AppointmentDatabase.Type> | undefined> => {
    const database = await AppointmentDatabase.load(date);
    if (!database) {
      res.status(500).json({ error: "Database not loaded" }).end();
      return;
    }
    return database;
  };
}
