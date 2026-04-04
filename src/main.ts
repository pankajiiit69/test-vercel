import 'reflect-metadata';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const bootstrapLogger = new Logger('Bootstrap');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = Number(process.env.PORT || 3000);
  await app.listen(port);
  bootstrapLogger.log(`Server running on http://localhost:${port}`);
}

bootstrap().catch((error: unknown) => {
  const stackOrMessage = error instanceof Error ? error.stack || error.message : String(error);
  bootstrapLogger.error('Application failed to start.', stackOrMessage);
  process.exit(1);
});