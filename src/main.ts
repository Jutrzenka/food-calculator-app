import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import configuration from './Utils/config/configuration';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { corsConfig } from './Utils/config/cors-config';
import { validationPipeConfig } from './Utils/config/validation-pipe-config';

async function bootstrap() {
  const app = (await NestFactory.create(AppModule)) as NestExpressApplication;
  app.use(cookieParser());
  app.use(helmet());
  app.enableCors(corsConfig);
  app.useGlobalPipes(validationPipeConfig);
  await app.listen(
    configuration().server.port,
    configuration().server.domain,
    () => {
      if (!configuration().server.isDeployment) {
        console.log('\x1b[42m' + 'Your .ENV:' + '\x1b[0m');
        console.log(configuration());
        console.log('\x1b[42m' + 'Your CORS config:' + '\x1b[0m');
        console.log(corsConfig);
        console.log('\x1b[42m' + 'Your Validation Pipe config:' + '\x1b[0m');
        console.log(validationPipeConfig);
      }
    },
  );
}
(async () => {
  await bootstrap();
})();
