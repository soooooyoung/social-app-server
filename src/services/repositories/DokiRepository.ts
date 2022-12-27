import type { Knex } from "knex";
import { qb } from "../../utils/KnexConnector";

interface BaseRepository<T> {
  findAll(item: Partial<T>): Promise<T[]>;
  findById(id: string | Partial<T>): Promise<T>;
}

export abstract class DokiRepository<T> implements BaseRepository<T> {
  constructor(public readonly tableName: string) {
    this.qb = qb(tableName);
  }
  public readonly qb: Knex.QueryBuilder;

  findAll(item: Partial<T>): Promise<T[]> {
    return this.qb.where(item).select();
  }

  async findById(id: Partial<T>): Promise<T> {
    return await this.qb.where(id).first();
  }

  async save(item: T): Promise<T> {
    const [output] = await this.qb.insert<T>(item).returning("*");

    return output;
  }
}
