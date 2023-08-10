import express, { Request, Response } from "express";
import cors, { CorsOptions } from "cors";
import { connectToDatabase } from "./services/database.service";
import { scoresRouter } from "./routers/scores.router";
import { AuthError, HMAC } from "hmac-auth-express";

const app = express();
const port = 3001;

export const corsOptions: CorsOptions = {
  origin: ['https://asteroids.notaroomba.xyz', 'http://asteroids.notaroomba.xyz', 'http://localhost:5173', 'http://localhost'],
}

const genSecret = async (req: Request) => {
  console.log(req)
  return 'a'
};

connectToDatabase()
  .then(() => {
    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(HMAC(genSecret));
    app.use("/scores", scoresRouter);

    app.use("/", async (_req: Request, res: Response) => {
      res.status(200).send("You arent supposed to be here");
    });
    app.use((error: { message: string; code: string; }, req: Request, res: Response, next: ()=>void) => {
      // check by error instance
      if (error instanceof AuthError) {
        res.status(401).json({
          error: "Invalid request",
          info: error.message,
        });
      }
      next();
    });
    app.listen(port, () => {
      console.log(`Server started at http://localhost:${port}`);
    });
  })
  .catch((error: Error) => {
    console.error("Database connection failed", error);
    process.exit();
  });
