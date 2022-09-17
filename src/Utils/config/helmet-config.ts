import { HelmetOptions } from 'helmet';
import configuration from './configuration';

const { ssl, port, domain } = configuration().server;

const whitelistAddress = [`${ssl ? 'https://' : 'http://'}${domain}:${port}`];

export const helmetConfig: Readonly<HelmetOptions> = {
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      'default-src': whitelistAddress,
      'script-src': whitelistAddress,
    },
  },
  expectCt: {
    maxAge: 96400,
    enforce: true,
  },
  dnsPrefetchControl: {
    allow: true,
  },
  frameguard: {
    action: 'deny',
  },
  hidePoweredBy: true,
  hsts: {
    maxAge: 3600,
    includeSubDomains: true,
  },
  ieNoOpen: true,
  noSniff: true,
  referrerPolicy: {
    policy: ['no-referrer-when-downgrade', 'origin'],
  },
  xssFilter: true,
};
