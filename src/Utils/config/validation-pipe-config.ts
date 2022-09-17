import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { RestStandardError } from '../class/RestStandardError';

export const validationPipeConfig = new ValidationPipe({
  skipUndefinedProperties: false,
  skipNullProperties: false,
  skipMissingProperties: false,
  stopAtFirstError: true,
  whitelist: true,
  enableDebugMessages: true,
  disableErrorMessages: true,
  exceptionFactory: () => {
    return new RestStandardError('Bad request', HttpStatus.BAD_REQUEST);
  },
});
