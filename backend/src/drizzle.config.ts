import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
export default defineConfig({
    out: './src/drizzle',
    schema: ["./src/Config/db/schema.js"],
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL,
    },
});
