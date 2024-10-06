import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import http from "http";
import routes from "../routes";
import { appConfigs } from "./configs";
import { startJob } from "../services/setting.service";

export const get = () => {
  const app: Application = express();
  const server = http.createServer(app);
  app.use(express.json());
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());

  app.get("/", async (_: Request, res: Response): Promise<Response> => {
    return res.status(200).send({
      message: `Welcome to the App API! \n Endpoints available at http://localhost:${appConfigs.PORT}/api/v1`,
    });
  });
  app.use("/api/v1", routes);

  return { app, server };
};

export const startServer = () => {
  const { server } = get();
  const port = appConfigs.PORT;
  try {
    server.listen(port, () => {
      console.log(
        `[Server]: Server Nodejs is running at http://localhost:${port}`,
      );
      void startJob();
    });
  } catch (error: any) {
    console.log(`Error occurred: ${error.message}`);
  }
};
