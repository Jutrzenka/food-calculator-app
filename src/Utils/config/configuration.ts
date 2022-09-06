export default () => ({
  server: {
    isDeployment: process.env.IS_DEPLOYMENT === 'true',
    ssl: process.env.SSL === 'true',
    domain: process.env.DOMAIN || 'localhost',
    port: parseInt(process.env.PORT, 10) || 3000,
    salt: parseInt(process.env.SALT_ROUND),
    secretKey: process.env.SECRET_OR_KEY,
  },
  // mailer: {
  //   service: process.env.SERVICE_MAILER ?? null,
  //   host: process.env.HOST_MAILER,
  //   port: parseInt(process.env.PORT_MAILER),
  //   secure: process.env.SECURE_MAILER === 'true',
  //   user: process.env.AUTH_USER_NAME_MAILER,
  //   pass: process.env.AUTH_USER_PASS_MAILER,
  //   from: process.env.FROM_MAILER,
  //   strict: process.env.STRICT_MAILER !== 'false',
  // },
  databaseMongo: {
    host: process.env.DB_NOSQL,
  },
});
