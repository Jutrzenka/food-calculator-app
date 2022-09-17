import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import configuration from './Utils/config/configuration';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { corsConfig } from './Utils/config/cors-config';
import { validationPipeConfig } from './Utils/config/validation-pipe-config';
import { helmetConfig } from './Utils/config/helmet-config';

async function bootstrap() {
  const app = (await NestFactory.create(AppModule)) as NestExpressApplication;
  app.use(cookieParser());
  app.use(helmet(helmetConfig));
  app.enableCors(corsConfig);
  app.useGlobalPipes(validationPipeConfig);
  await app.listen(
    configuration().server.port,
    configuration().server.domain,
    () => {
      console.log('\x1b[42m' + 'Your .ENV:' + '\x1b[0m');
      console.dir(configuration(), { depth: null });
      console.log('\x1b[42m' + 'Your HELMET config:' + '\x1b[0m');
      console.dir(helmetConfig, { depth: null });
      console.log('\x1b[42m' + 'Your CORS config:' + '\x1b[0m');
      console.dir(corsConfig, { depth: null });
      console.log('\x1b[42m' + 'Your Validation Pipe config:' + '\x1b[0m');
      console.dir(validationPipeConfig, { depth: null });
    },
  );
}
(async () => {
  await bootstrap();
})();
