import { readFile } from "node:fs/promises";
import postgres from "postgres";

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL is required to run the database migration.");
}

const sql = postgres(url, {
  ssl: process.env.DATABASE_SSL === "disable" ? false : "require",
  max: 1,
  connect_timeout: 10,
  prepare: false,
});

try {
  const migration = await readFile(new URL("../db/migrations/001_users.sql", import.meta.url), "utf8");
  const statements = migration
    .split(/;\s*(?:\n|$)/)
    .map((statement) => statement.trim())
    .filter(Boolean);

  for (const statement of statements) {
    await sql.unsafe(statement);
  }

  console.log(`Applied ${statements.length} database statements.`);
} finally {
  await sql.end({ timeout: 5 });
}
