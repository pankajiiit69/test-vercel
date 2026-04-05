import 'dotenv/config';
import { readFileSync } from 'fs';
import { Logger } from '@nestjs/common';
import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from '../users/user.entity';

const dbLogger = new Logger('Database');

let initializationPromise: Promise<DataSource> | null = null;

type DbSslOptions = {
  rejectUnauthorized: boolean;
  ca?: string;
};

const loadCaFromPath = (filePath?: string): string | undefined => {
  if (filePath && filePath.trim().length > 0) {
    return readFileSync(filePath, 'utf8');
  }

  return undefined;
};

const resolveSslFromMode = (rawMode: string): false | DbSslOptions => {
  const ca = loadCaFromPath(process.env.DB_SSL_CA_PATH);

  const withCa = (rejectUnauthorized: boolean): DbSslOptions => ({
    rejectUnauthorized,
    ...(ca ? { ca } : {}),
  });

  switch (rawMode.toLowerCase()) {
    case 'disable':
      return false;
    case 'verify-ca':
    case 'verify-full':
      return withCa(true);
    case 'allow':
    case 'prefer':
    case 'require':
    case 'no-verify':
      return withCa(false);
    default:
      dbLogger.warn(`Unsupported DB_SSLMODE "${rawMode}". Falling back to "require".`);
      return withCa(false);
  }
};

export const buildTypeOrmOptions = (): DataSourceOptions => {
  const dbSslMode = process.env.DB_SSLMODE || 'require';

  return {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'postgres',
    ssl: resolveSslFromMode(dbSslMode),
    entities: [User],
    migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
    migrationsTableName: 'typeorm_migrations',
    logging: ['error'],
    synchronize: (process.env.DB_SYNCHRONIZE || 'false').toLowerCase() === 'true',
  };
};

export const AppDataSource = new DataSource(buildTypeOrmOptions());

export const initializeAppDataSource = async (): Promise<DataSource> => {
  if (AppDataSource.isInitialized) {
    dbLogger.log('PostgreSQL datasource is already connected.');
    return AppDataSource;
  }

  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = AppDataSource.initialize()
    .then((dataSource) => {
      dbLogger.log('PostgreSQL datasource connected successfully.');
      return dataSource;
    })
    .catch((error: unknown) => {
      const stackOrMessage = error instanceof Error ? error.stack || error.message : String(error);
      dbLogger.error('Failed to connect PostgreSQL datasource.', stackOrMessage);
      initializationPromise = null;
      throw error;
    });

  return initializationPromise;
};