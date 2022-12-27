"use strict";
import "reflect-metadata";
import { DokiServer } from "./server";
import * as MySQLConnector from "./utils/KnexConnector";

async function start(): Promise<void> {
  MySQLConnector.initPool();
  const server = new DokiServer();
  await server.startServer();
}

start().catch((err) => {
  // TODO: Logger implementation - 작업 생략
  //   logError(
  //     `SERVER SETUP ERROR
  //         ${err.message}`
  //   );
  console.log(err.message);
  process.exit(-1);
});
