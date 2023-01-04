import { RoutingControllersOptions } from "routing-controllers";

export const routingControllerOptions: RoutingControllersOptions = {
  cors: {
    origin: ["https://snsus.click"],
    credentials: true,
    exposedHeaders: ["set-cookie"],
  },
  controllers: [`${__dirname}/../controllers/*{.ts,.js}`],
  defaultErrorHandler: false,
};
