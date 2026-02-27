import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { JsonObject } from '@prisma/client/runtime/client';

@Injectable()
export abstract class CrudService<
  Model,
  CreateInput,
  UpdateInput,
  WhereUniqueInput,
  WhereInput = any
> {
  protected constructor(
    protected readonly prisma: PrismaService,
    protected readonly cache: CacheService,
    private readonly modelDelegate: any,
    private readonly modelName: string,
  ) { }


  protected buildCacheKey(prefix: string, identifier: any): string {
    return `${this.modelName}:${prefix}:${JSON.stringify(identifier)}`;
  }

  async create(data: CreateInput): Promise<Model> {
    const result = await this.modelDelegate.create({ data });
    return result;
  }

  async findUnique(where: WhereUniqueInput, ttl = 3600): Promise<Model | null> {
    const cacheKey = this.buildCacheKey('unique', where);

    const cached = await this.cache.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const result = await this.modelDelegate.findUnique({ where });

    if (result) {
      await this.cache.set(cacheKey, JSON.stringify(result, (key, value) => {
        if (typeof value === 'bigint') {
          return value.toString(); // Convert BigInt to string
        }
        return value; // Return everything else unchanged
      })
      , ttl);
    }

    return result;
  }

  async update(
    where: WhereUniqueInput,
    data: UpdateInput,
  ): Promise<Model> {
    const result = await this.modelDelegate.update({ where, data });

    // Invalidate cache
    const cacheKey = this.buildCacheKey('unique', where);
    await this.cache.del(cacheKey);

    return result;
  }

  async delete(where: WhereUniqueInput): Promise<Model> {
    const result = await this.modelDelegate.delete({ where });

    // Invalidate cache
    const cacheKey = this.buildCacheKey('unique', where);
    await this.cache.del(cacheKey);

    return result;
  }
}
