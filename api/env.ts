import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.join(process.cwd(), '.env') });

interface IEnv {
  API_PORT: string;
}

export const env: IEnv = {
  API_PORT: process.env.API_PORT,
};

console.log(env);
