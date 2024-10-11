import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres' as const,
  host: process.env.POSTGRES_HOST_NAME ?? 'localhost',
  port: Number(process.env.POSTGRES_LOCAL_PORT) || 5432,
  username: process.env.POSTGRES_USER ?? 'your_username',
  password: process.env.POSTGRES_PASSWORD ?? 'your_password',
  database: process.env.POSTGRES_DB ?? 'your_database',
  synchronize: false,
  logging: false,
  entities: ['src/entity/**/*.ts'],
  migrations: ['src/migration/**/*.ts'],
});
