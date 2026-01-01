import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({
  path: [
    path.join(__dirname, '../.env'),
    path.join(__dirname, '../.env.example'),
  ],
  override: false,
});

interface IEnv {
  API_PORT: string | undefined;
  API_HOST: string | undefined;
  SPEED_LIMIT: string | undefined;
}

export const env: IEnv = {
  API_PORT: process.env.API_PORT,
  API_HOST: process.env.API_HOST,
  SPEED_LIMIT: process.env.SPEED_LIMIT,
};

console.log(env);
