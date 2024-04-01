import express, { Router, Request, Response } from "express";
import { ServiceDatabase } from "../database/Service.db.js";
import { Service } from "../../core/Service.js";
import { nanoid } from "nanoid";

export namespace ServiceApi {
  export const database = ServiceDatabase.load();

  export const router = (): Router => {
    const router = express.Router();

    router.get("/", async (_, res) => {
      const db = await database;
      if (db) {
        res.status(200).json(db.data.services).end();
      } else {
        res.status(500).json({ error: "Database not loaded" }).end();
      }
    });

    router.post("/", async (req, res) => {
      const service = validate(req.body, res);

      if (!service) return;

      service.id = nanoid();
      if (!service.description) service.description = "";

      const db = await database;
      if (!db) {
        res.status(500).json({ error: "Database not loaded" }).end();
        return;
      }

      db.update(({ services }) => services.push(service));
      res.json(db.data.services);
    });

    router.put("/:id", async (req, res) => {
      const id = req.params.id;
      const db = await database;

      if (!id) {
        res.status(500).json({ error: "ID not specified" }).end();
        return;
      }

      if (db) {
        const service = validate(req.body, res);
        if (!service) {
          return;
        }
        const databaseService = db.data.services.find(
          (service) => service.id == id
        );
        if (!databaseService) {
          res.status(404).json({ error: "Service not found" }).end();
        } else {
          databaseService.name = service.name || databaseService.name;
          databaseService.description =
            service.description || databaseService.description;
          databaseService.price = service.price || databaseService.price;
          db.write();

          res.status(200).json(service).end();
        }
      } else {
        res.status(500).json({ error: "Database not loaded" }).end();
      }
    });

    return router;
  };

  export const validate = (body: any, res: Response): Service | undefined => {
    const service = body as Service;
    if (!service.name) {
      res.status(500).json({ error: "Name not specified" }).end();
      return;
    }
    if (!service.price) {
      res.status(500).json({ error: "Price not specified" }).end();
      return;
    }
    return service;
  };
}
