"use strict";
import "reflect-metadata";
import { logError } from "./utils/Logger";
import { DokiServer } from "./server";
import * as MySQLConnector from "./utils/KnexConnector";

async function start(): Promise<void> {
  MySQLConnector.initPool();
  const server = new DokiServer();
  await server.startServer();
}

start().catch((err) => {
  logError(err.message);
  process.exit(-1);
});
