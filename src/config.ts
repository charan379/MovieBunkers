require("dotenv").config();

const Config = Object.freeze({
  PORT: process.env.PORT || 3000,
  DOMAIN_NAME: process.env.DOMAIN_NAME || "http://localhost:3000",
  MongoDB_SERVER_STRING: process.env.MONGODB_SERVER_STRING,
  HTTPS: process.env.HTTPS === "true" ? true : false,
  COOKIE_SECRET: process.env.COOKIE_SECRET || "laka*%^+=-(`~1!laka*%^+=-(`~1!laka*%^+=-(`~1!laka thom thom*%^+=-(`~1!thom",
  JWT_SECRET: process.env.JWT_SECRET || "laka*%^+=-(`~1!laka*%^+=-(`~1!laka*%^+=-(`~1!laka thom thom*%^+=-(`~1!thom",
  CORS_ORIGINS: process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(",").map((origin) => origin)
    : ["http://localhost:3000"],
  SUPER_ADMIN: process.env.SUPER_ADMIN,
  MAIL_SERVICE_PROVIDER: process.env.MAIL_SERVICE_PROVIDER,
  MAIL_SERVICE_HOST: process.env.MAIL_SERVICE_HOST,
  MAIL_SERVICE_PORT: process.env.MAIL_SERVICE_PORT,
  MAIL_SERVICE_AUTH_USER: process.env.MAIL_SERVICE_AUTH_USER,
  MAIL_SERVICE_AUTH_PASSWORD: process.env.MAIL_SERVICE_AUTH_PASSWORD,
  NODE_ENV: process.env?.NODE_ENV ?? "development"
});

export default Config;