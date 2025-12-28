import { env } from './env';

export const API = {
  ENV: env.NODE_ENV,
  PORT: env.API_PORT
    ? Number.parseInt(env.API_PORT) || env.API_PORT
    : undefined,
  HOST: env.API_HOST,
};
