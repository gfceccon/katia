import express, { Router, Request, Response } from "express";
import { EmployeeDatabase } from "../database/Employee.db.js";
import { Employee } from "../../core/Employee.js";
import { nanoid } from "nanoid";
import { AppointmentDatabase } from "../database/Appointment.db.js";
import { getAppointmentFiles } from "../../core/Appointment.js";

export namespace EmployeeApi {
  export const database = EmployeeDatabase.load();

  export const router = (): Router => {
    const router = express.Router();

    router.get("/", async (_, res) => {
      const db = await database;
      if (db) {
        res.status(200).json(db.data.employees).end();
      } else {
        res.status(500).json({ error: "Database not loaded" }).end();
      }
    });

    router.post("/", async (req, res) => {
      const employee = validate(req.body, res);

      if (!employee) return;

      employee.id = nanoid();
      employee.appointments = [];

      const db = await database;
      if (!db) {
        res.status(500).json({ error: "Database not loaded" }).end();
        return;
      }

      db.update(({ employees }) => employees.push(employee));
      res.json(db.data.employees);
    });
    
    router.put("/:id", async (req, res) => {
      const id = req.params.id;
      const db = await database;

      if (!id) {
        res.status(500).json({ error: "ID not specified" }).end();
        return;
      }

      if (db) {
        const employee = validate(req.body, res);
        if (!employee) {
          return;
        }
        const databaseEmployee = db.data.employees.find(
          (employee) => employee.id == id
        );
        if (!databaseEmployee) {
          res.status(404).json({ error: "Employee not found" }).end();
        } else {
          databaseEmployee.name = employee.name || databaseEmployee.name;
          db.write();

          res.status(200).json(databaseEmployee).end();
        }
      } else {
        res.status(500).json({ error: "Database not loaded" }).end();
      }
    });

    router.get("/:id/history", async (req, res) => {
      const id = req.params.id;
      const db = await database;
      if (!id) {
        res.status(500).json({ error: "Id not specified" }).end();
        return;
      }
      if (!db) {
        res.status(500).json({ error: "Database not loaded" }).end();
        return;
      }

      const employee = db.data.employees.find((employee) => employee.id == id);

      if (!employee) {
        res.status(404).json({ error: "Employee not found" }).end();
        return;
      }

      const dbs = await Promise.all(
        getAppointmentFiles(employee).map((file) =>
          AppointmentDatabase.load(file)
        )
      );

      const appointments = dbs
        .map((db) => db.data.appointments)
        .flat()
        .filter((appointment) => appointment.employee.id == id);
      res.status(200).json(appointments).end();
    });

    return router;
  };

  export const validate = (body: any, res: Response): Employee | undefined => {
    const employee = body as Employee;
    if (!employee.name) {
      res.status(500).json({ error: "Name not specified" }).end();
      return;
    }
    return employee;
  };
}
