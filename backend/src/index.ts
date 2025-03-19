import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import studentRoutes from "@routes/students.router";
import { connectToDatabase } from "@service/database.service";
// Guide link: https://blog.logrocket.com/how-to-set-up-node-typescript-express/

dotenv.config();

const app = express();
const port = process.env.PORT;

connectToDatabase().catch((onrejected) => {
  console.log(`[server]: Database connection error - (${onrejected})`);
});

// Allow the app to accept JSON
app.use(express.json());

// Same-origin policy countermeasure
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE"],
  })
);

app.use("/students", studentRoutes);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(`[server]: Something broke on the server!`);
  console.error(err.stack);
  res.status(500).send("The server is broken!");
});

app.get("/", (_: Request, res: Response) => {
  res.send("Ehlo from the server!");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at [http://localhost:${port}]`);
  console.log(`[Server]: Using Ctrl + C to shut down the server\n`);
});
