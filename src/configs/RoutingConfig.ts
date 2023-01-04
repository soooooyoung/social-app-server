import { RoutingControllersOptions } from "routing-controllers";

export const routingControllerOptions: RoutingControllersOptions = {
  cors: {
    origin: ["https://snsus.click", "http://localhost:3000"],
    credentials: true,
    exposedHeaders: ["set-cookie"],
  },
  controllers: [`${__dirname}/../controllers/*{.ts,.js}`],
  defaultErrorHandler: false,
};
