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
  NODE_ENV: string | undefined;
  API_PORT: string | undefined;
  API_HOST: string | undefined;
}

export const env: IEnv = {
  NODE_ENV: process.env.NODE_ENV,
  API_PORT: process.env.API_PORT,
  API_HOST: process.env.API_HOST,
};

console.log(env);
