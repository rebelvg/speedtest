import { env } from './env';

export const API = {
  PORT: env.API_PORT
  ? Number.parseInt(env.API_PORT) || env.API_PORT
  : undefined,
  HOST: env.API_HOST,
  SPEED_LIMIT: env.SPEED_LIMIT?.toLowerCase() === 'true',
};
