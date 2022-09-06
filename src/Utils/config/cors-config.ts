import configuration from './configuration';

const { isDeployment, ssl, port, domain } = configuration().server;

const whitelistAddress = [`${ssl ? 'https://' : 'http://'}${domain}:${port}`];
const whitelistMethod = [`GET`, 'PUT', 'POST', 'PATCH'];

export const corsConfig = {
  origin: isDeployment ? whitelistAddress : false,
  methods: isDeployment ? whitelistMethod : null,
  credentials: true,
  optionsSuccessStatus: 200,
};
