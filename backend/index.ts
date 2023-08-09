import express, { Request, Response } from "express";
import cors, { CorsOptions } from "cors";
import { connectToDatabase } from "./services/database.service";
import { scoresRouter } from "./routers/scores.router";

const app = express();
const port = 3001;

const corsOptions: CorsOptions = {
  origin: "https://asteroids.notaroomba.xyz",
  optionsSuccessStatus: 200,
};

connectToDatabase()
  .then(() => {
    app.use(cors<Request>(corsOptions));
    app.use("/scores", scoresRouter);

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
