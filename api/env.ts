import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.join(process.cwd(), '.env') });

interface IEnv {
  API_PORT: string | undefined;
  API_HOST: string | undefined;
}

export const env: IEnv = {
  API_PORT: process.env.API_PORT,
  API_HOST: process.env.API_HOST,
};

console.log(env);
