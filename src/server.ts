import * as express from "express";
import * as compression from "compression";
import * as bodyParser from "body-parser";
import { Container } from "typedi";
import { useContainer, useExpressServer } from "routing-controllers";
import { routingControllerOptions } from "./configs/RoutingConfig";
import { logError, logInfo } from "./utils/Logger";

export class DokiServer {
  public PORT: number = Number(process.env.PORT) || 9000;
  private readonly app: express.Application;

  constructor() {
    this.app = express();
    this.setConfig();
  }

  /**
   * Start server.
   */
  public async startServer(): Promise<void> {
    useContainer(Container);
    useExpressServer(this.app, routingControllerOptions);
    return new Promise<void>((resolve, reject) => {
      this.app
        .listen(this.PORT, () => {
          logInfo(`SERVER START ON PORT : ${this.PORT}`);

          return resolve();
        })
        .on("error", (e) => {
          logError("SERVER START ERROR : ", e);

          return reject(e);
        });
    });
  }

  /**
   * set express app config
   */
  private async setConfig() {
    this.app.use(compression());
    this.app.use(bodyParser.json({ limit: "50mb" }));
    this.app.use(
      bodyParser.urlencoded({
        limit: "50mb",
        extended: true,
        parameterLimit: 100000,
      })
    );
  }
}
