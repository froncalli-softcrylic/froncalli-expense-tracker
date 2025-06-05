import { neon } from "@neondatabase/serverless";

import "dotenv/config";

// CREATES A SQL CONNECTION USING OUR DATABASE URL
export const sql = neon(process.env.DATABASE_URL);
