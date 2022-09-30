import configuration from './configuration';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

const { ssl, port, domain } = configuration().server;

const whitelistAddress = [
  `${ssl ? 'https://' : 'http://'}${domain}:${port}`,
  'http://localhost:5173',
];
const whitelistMethod = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

export const corsConfig: CorsOptions = {
  origin: whitelistAddress,
  methods: whitelistMethod,
  credentials: true,
  optionsSuccessStatus: 200,
};
