import express, { Request, Response } from "express";
import cors, { CorsOptions } from "cors";
import { connectToDatabase } from "./services/database.service";
import { scoresRouter } from "./routers/scores.router";

const app = express();
const port = 3001;

export const corsOptions: CorsOptions = {
  origin: ['https://asteroids.notaroomba.xyz', 'http://asteroids.notaroomba.xyz'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true // enable set cookie
}

connectToDatabase()
  .then(() => {
    app.use(cors(corsOptions));
    app.use("/scores", scoresRouter, cors(corsOptions));

    app.use("/", async (_req: Request, res: Response) => {
      res.status(200).send("You arent supposed to be here");
    });
    app.listen(port, () => {
      console.log(`Server started at http://localhost:${port}`);
    });
  })
  .catch((error: Error) => {
    console.error("Database connection failed", error);
    process.exit();
  });
