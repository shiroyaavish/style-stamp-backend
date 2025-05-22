export default () => ({
  environment: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 8080,
  database: {
    uri: process.env.MONGODB_URI,
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    refreshSecret: process.env.REFRESH_SECRET,
  },
  app: {
    title: process.env.TITLE,
    description: process.env.DESCRIPTION,
    version: process.env.VERSION,
  },
  twilio: {
    account_sid: process.env.TWILIO_ACCOUNT_SID,
    auth_token: process.env.TWILIO_AUTH_TOKEN,
    service_sid: process.env.TWILIO_SERVICE_SID,
  },
  mail: {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: process.env.MAIL_SECURE,
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,
    from: process.env.MAIL_FROM,
  },
  postfinance:{
    spaceId:process.env.SPACE_ID,
    userId:process.env.USER_ID,
    apiSecret:process.env.API_SECRET
  }
});
