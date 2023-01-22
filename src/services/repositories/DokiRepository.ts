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
  protected tableName: string;

  async findAll(
    item: Partial<T>,
    sortBy?: keyof T,
    direction?: "desc" | "asc"
  ): Promise<T[]> {
    if (sortBy) {
      return await qb(this.tableName)
        .where(item)
        .select()
        .orderBy(sortBy, direction ?? "desc");
    }
    return await qb(this.tableName).where(item).select();
  }

  async findById(id: Partial<T>): Promise<T> {
    return await qb(this.tableName)
      .where(id)
      .first()
      .then((data) => {
        if (data) {
          JSON.parse(JSON.stringify(data));
        }
        return data;
      });
  }

  async save(item: T): Promise<any> {
    const [output] = await qb(this.tableName).insert<T>(item).returning("*");

    return output;
  }
}
