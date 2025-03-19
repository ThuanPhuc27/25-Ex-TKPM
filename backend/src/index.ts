import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import studentRoutes from "@routes/studentsRoute";
import { connectToDatabase } from "@service/database.service";
import logger from './logger';

// Guide link: https://blog.logrocket.com/how-to-set-up-node-typescript-express/

dotenv.config();

const app = express();
const port = process.env.PORT;

connectToDatabase().catch((onrejected) => {
  logger.info(`[server]: Database connection error - (${onrejected})`);
});

app.use(express.json());
app.use("/students", studentRoutes);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error(`[server]: Something broke on the server!`);
  logger.error(err.stack);
  res.status(500).send("The server is broken!");
});

app.get("/", (_: Request, res: Response) => {
  res.send("Ehlo from the server!");
});

app.listen(port, () => {
  logger.info(`[server]: Server is running at [http://localhost:${port}]`);
  logger.info(`[Server]: Using Ctrl + C to shut down the server\n`);
});
