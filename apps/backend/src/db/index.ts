// src/db/index.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.js";
import dotenv from "dotenv";
dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

// Create the connection
const client = postgres(connectionString, {
  prepare: false,
});

export const db = drizzle(client, { schema });

export * from "./schema.js";
