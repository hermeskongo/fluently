import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "./schema.js";
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false
});

export const db = drizzle(pool, { schema });

export async function testDrizzle() {
    try {
        await db.execute('SELECT NOW()');
        console.log('DataBase Connected !✅ ');
    } catch (error) {
        console.error('❌ Erreur Drizzle :', error.message);
    }
}