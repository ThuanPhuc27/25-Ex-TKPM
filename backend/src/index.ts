import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import studentRoutes from "@routes/studentRoute";
import studentStatusRoutes from "@routes/studentStatusRoute";
import facultyRoutes from "@routes/facultyRoute";
import programRoutes from "@routes/programRoute";
import configRoutes from "@routes/configRoute";
import domainRoutes from "@routes/domainRoute";
import ruleRoutes from "@routes/ruleRoutes";
import classRoutes from "@routes/classRoute";
import courseRoutes from "@routes/courseRoute";
import enrollmentRoutes from "@routes/enrollmentRoute";

import { connectToDatabase } from "@services/database.service";
import logger from "./logger";
import { http } from "./constants/httpStatusCodes";

// Guide link: https://blog.logrocket.com/how-to-set-up-node-typescript-express/

dotenv.config();

const app = express();
const port = process.env.PORT;

connectToDatabase().catch((onrejected) => {
  logger.info(`[server]: Database connection error - (${onrejected})`);
});

// Allow the app to accept JSON
app.use((req: Request, res: Response, next: NextFunction) => {
  express.json()(req, res, (error: any) => {
    if (error) {
      res
        .status(http.BAD_REQUEST)
        .json({ message: `Invalid JSON payload - ${error.message}` });
      return;
    }
    next();
  });
});

// Same-origin policy countermeasure
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE"],
  })
);

app.use("/students", studentRoutes);
app.use("/config", configRoutes);
app.use("/studentStatus", studentStatusRoutes);
app.use("/faculty", facultyRoutes);
app.use("/program", programRoutes);
app.use("/domains", domainRoutes);
app.use("/rules", ruleRoutes);
app.use("/classes", classRoutes);
app.use("/courses", courseRoutes);
app.use("/enrollments", enrollmentRoutes);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error(`[server]: Something broke on the server!`);
  logger.error(err.stack);
  res
    .status(http.INTERNAL_SERVER_ERROR)
    .send({ message: "The server is broken!" });
});

app.get("/", (_: Request, res: Response) => {
  res.send("Ehlo from the server!");
});

app.listen(port, () => {
  logger.info(`[server]: Server is running at [http://localhost:${port}]`);
  logger.info(`[Server]: Using Ctrl + C to shut down the server\n`);
});
