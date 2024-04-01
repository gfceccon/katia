import express, { Router, Request, Response } from "express";
import { ClientDatabase } from "../database/Client.db.js";
import { Client } from "../../core/Client.js";
import { nanoid } from "nanoid";
import { existsSync } from "fs";
import { AppointmentDatabase } from "../database/Appointment.db.js";
import { BodyParser } from "body-parser";
import createServer from "connect";
import { exists } from "../database/Database.js";
import { getAppointmentFiles } from "../../core/Appointment.js";

export namespace ClientApi {
  export const database = ClientDatabase.load();

  export const router = (): Router => {
    const router = express.Router();

    router.get("/", async (_, res) => {
      const db = await database;
      if (db) {
        res.status(200).json(db.data.clients);
      } else {
        res.status(500).json({ error: "Database not loaded" }).end();
      }
    });

    router.post("/", async (req, res) => {
      const client = validate(req.body, res);

      if (!client) return;
      client.id = nanoid();
      client.appointments = [];

      const db = await database;
      if (!db) {
        res.status(500).json({ error: "Database not loaded" }).end();
        return;
      }

      db.update(({ clients }) => clients.push(client));
      res.json(db.data.clients);
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

      const client = db.data.clients.find((client) => client.id == id);

      if (!client) {
        res.status(404).json({ error: "Client not found" }).end();
        return;
      }

      const dbs = await Promise.all(
        getAppointmentFiles(client).map((file) => {
          console.log(file);
          return AppointmentDatabase.load(file);
        })
      );

      const appointments = dbs
        .map((db) => db.data.appointments)
        .flat()
        .filter((appointment) => appointment.client.id == id);

      res.status(200).json(appointments).end();
    });

    return router;
  };

  export const validate = (body: any, res: Response): Client | undefined => {
    const client = body as Client;
    if (!client.name) {
      res.status(500).json({ error: "Name not specified" }).end();
      return;
    }
    if (!client.number) {
      res.status(500).json({ error: "Number not specified" }).end();
      return;
    }
    return client;
  };
}
