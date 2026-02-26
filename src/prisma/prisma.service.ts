import { Injectable, OnModuleInit, INestApplication } from '@nestjs/common'
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from 'generated/prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
 const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST,         // e.g., 'localhost'
  user: process.env.DB_USER,         // e.g., 'your_username'
  password: process.env.DB_PASSWORD, // e.g., 'your_password'
  database: process.env.DB_NAME,     // e.g., 'your_database'
  port: Number(process.env.DB_PORT), // e.g., 3306
  connectionLimit: 5,                // optional
  // Other optional parameters like connectTimeout, idleTimeout, ssl, etc.
});
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect()
  }

}