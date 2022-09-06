import { ValidationPipe } from '@nestjs/common';
import configuration from './configuration';

export const validationPipeConfig = new ValidationPipe({
  skipUndefinedProperties: false,
  skipNullProperties: false,
  skipMissingProperties: false,
  stopAtFirstError: true,
  whitelist: true,
  enableDebugMessages: !configuration().server.isDeployment,
  disableErrorMessages: configuration().server.isDeployment,
});
