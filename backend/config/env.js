import { config } from 'dotenv';

const envFilePath = `.env.${process.env.NODE_ENV || 'development'}.local`;

const result = config({ path: envFilePath});

if (result.error) {
    console.error("❌ Failed to load dotenv file:", result.error);
} else {
    console.log("✅ Dotenv file loaded:", envFilePath);
}

export const PORT = process.env.PORT;
export const NODE_ENV = process.env.NODE_ENV;
export const DB_URI = process.env.DB_URI;
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
