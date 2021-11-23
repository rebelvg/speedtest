import { env } from './env';

export const API = {
  PORT: Number.parseInt(env.API_PORT) || env.API_PORT,
};
