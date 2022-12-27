import type { Knex } from "knex";
import { qb } from "../../utils/KnexConnector";

interface BaseRepository<T> {
  findAll(item: Partial<T>): Promise<T[]>;
  findById(id: string | Partial<T>): Promise<T>;
}

export abstract class DokiRepository<T> implements BaseRepository<T> {
  constructor(public readonly name: string) {
    this.tableName = name;
  }
  private tableName: string;

  findAll(item: Partial<T>): Promise<T[]> {
    return qb(this.tableName).where(item).select();
  }

  async findById(id: Partial<T>): Promise<T> {
    return await qb(this.tableName).where(id).first();
  }

  async save(item: T): Promise<T> {
    const [output] = await qb(this.tableName).insert<T>(item).returning("*");

    return output;
  }
}
