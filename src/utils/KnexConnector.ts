import { knex, Knex } from "knex";
import { IllegalStateException } from "../models/exceptions";
import { env } from "../configs/env";

let pool: Knex;

export const initPool = () => {
  try {
    const dataSource = env.db;
    pool = knex({
      client: "mysql",
      connection: {
        host: dataSource.DB_HOST,
        user: dataSource.DB_USER,
        password: dataSource.DB_PASSWORD,
        database: dataSource.DB_DATABASE,
      },
    });
    console.debug("MySql Pool generated successfully: ", pool);
  } catch (e) {
    throw new IllegalStateException("failed to initialized pool" + e);
  }
};

export const qb = (tableName: string) => pool(tableName);
