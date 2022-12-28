import { RoutingControllersOptions } from "routing-controllers";

export const routingControllerOptions: RoutingControllersOptions = {
  cors: {
    //TODO: add instance origin
    origin: ["http://localhost:3000"],
    credentials: true,
    exposedHeaders: ["set-cookie"],
  },

  controllers: [`${__dirname}/../controllers/*{.ts,.js}`],
  defaultErrorHandler: false,
};
