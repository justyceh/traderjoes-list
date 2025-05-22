import { config } from 'dotenv';

config();

export const PORT = parseInt(process.env.PORT, 10) || 5199;
export const NODE_ENV = process.env.NODE_ENV;
export const DB_URI = process.env.DB_URI;
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
