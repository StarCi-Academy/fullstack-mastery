// bỏ toàn bộ biến môi trường vào trong 1 object envConfig
// cực kì thuận lời cho việc gọi biến môi trường trong project
const envConfig = () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  name: process.env.NAME || 'NestJS',
  description:
    process.env.DESCRIPTION ||
    'NestJS is a framework for building server-side applications',
  nestedConfig: {
    a: process.env.A ?? '1',
    b: process.env.B ?? '2',
    c: process.env.C ?? '3',
  },
  // key fake
  openApiKey: process.env.OPEN_API_KEY ?? '1234567890',
  database: {
    host: process.env.DATABASE_HOST ?? 'localhost',
    port: parseInt(process.env.DATABASE_PORT ?? '6969', 10),
    username: process.env.DATABASE_USERNAME ?? 'root',
    password: process.env.DATABASE_PASSWORD ?? 'my-secret-pw',
    database: process.env.DATABASE_NAME ?? 'cuong',
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? 'dev-secret-change-in-production',
    /** Access token (Bearer) — ngắn hạn */
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '15m',
    /** Refresh token ký riêng, lưu jti trong Redis để revoke / rotate */
    refreshSecret:
      process.env.JWT_REFRESH_SECRET ?? 'dev-refresh-secret-change-in-production',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '30d',
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID ?? '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    callbackUrl:
      process.env.GOOGLE_CALLBACK_URL ??
      'http://localhost:3000/auth/google/callback',
  },
});

export default envConfig;