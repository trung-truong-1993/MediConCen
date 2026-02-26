import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { CrudService } from '../common/crud.service';
import { v4 as uuidv4 } from 'uuid'
import { Prisma, UserMapping } from 'generated/prisma/client';

@Injectable()
export class UserService extends CrudService<
  UserMapping,
  Prisma.UserMappingCreateInput,
  Prisma.UserMappingUpdateInput,
  Prisma.UserMappingWhereUniqueInput,
  Prisma.UserMappingWhereInput
> {
  constructor(
    protected readonly prismaService: PrismaService,
    protected readonly cacheService: CacheService,
  ) {
    super(
      prismaService,
      cacheService,
      prismaService.userMapping,
      'userMapping',
    );
  }

  async postUser(id1: string, id2: string): Promise<string> {
    // Get and check
    const existing = await this.findUnique({
      id1_id2: { id1, id2 },
    });

    if (existing) return existing.userId;

    // Create
    const newUserId = uuidv4();

    try {
      const created = await this.create({
        id1,
        id2,
        userId: newUserId,
      });

      return created.userId;
    } catch (error) {
      // Handle race condition (unique constraint)
      const retry = await this.findUnique({
        id1_id2: { id1, id2 },
      });

      if (retry) return retry.userId;

      throw error;
    }
  }

}
