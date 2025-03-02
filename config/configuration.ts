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
});
