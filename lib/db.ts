import postgres from "postgres";

export type UserRole = "admin" | "manager" | "sales" | "employee";

export interface User {
  id: string;
  email: string;
  passwordHash: string | null;
  name: string | null;
  role: UserRole;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  twoFactorSecret: string | null;
  otpCode: string | null;
  otpExpiry: number | null;
  resetToken: string | null;
  resetExpiry: number | null;
  verifyToken: string | null;
  provider: string | null;
}

type UserRow = {
  id: string;
  email: string;
  password_hash: string | null;
  name: string | null;
  role: UserRole;
  email_verified: boolean;
  two_factor_enabled: boolean;
  two_factor_secret: string | null;
  otp_code: string | null;
  otp_expiry: number | string | bigint | null;
  reset_token: string | null;
  reset_expiry: number | string | bigint | null;
  verify_token: string | null;
  provider: string | null;
};

type DatabaseClient = ReturnType<typeof postgres>;

let dbClient: DatabaseClient | null = null;
let schemaPromise: Promise<void> | null = null;

function getDb(): DatabaseClient {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not configured. Add a PostgreSQL connection string to the deployment environment.");
  }

  if (!dbClient) {
    dbClient = postgres(url, {
      ssl: process.env.DATABASE_SSL === "disable" ? false : "require",
      max: 5,
      idle_timeout: 20,
      connect_timeout: 10,
      prepare: false,
    });
  }

  return dbClient;
}

/**
 * Creates the application schema once per server process. The SQL is additive and
 * safe to run concurrently, which keeps serverless cold starts self-healing while
 * the checked-in migration remains available for explicit deployment setup.
 */
export async function ensureDatabaseSchema(): Promise<void> {
  if (!schemaPromise) {
    schemaPromise = (async () => {
      const db = getDb();
      await db`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email VARCHAR(320) NOT NULL UNIQUE,
          password_hash TEXT,
          name VARCHAR(255),
          role VARCHAR(32) NOT NULL DEFAULT 'employee',
          email_verified BOOLEAN NOT NULL DEFAULT FALSE,
          two_factor_enabled BOOLEAN NOT NULL DEFAULT FALSE,
          two_factor_secret TEXT,
          otp_code VARCHAR(6),
          otp_expiry BIGINT,
          reset_token TEXT,
          reset_expiry BIGINT,
          verify_token TEXT,
          provider VARCHAR(64),
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
      await db`CREATE INDEX IF NOT EXISTS users_reset_token_idx ON users (reset_token)`;
      await db`CREATE INDEX IF NOT EXISTS users_verify_token_idx ON users (verify_token)`;
    })().catch((error) => {
      schemaPromise = null;
      throw error;
    });
  }

  await schemaPromise;
}

export function generateId(): string {
  return `user_${globalThis.crypto.randomUUID()}`;
}

function toNumber(value: number | string | bigint | null): number | null {
  return value === null ? null : Number(value);
}

function toUser(row: UserRow): User {
  return {
    id: row.id,
    email: row.email,
    passwordHash: row.password_hash,
    name: row.name,
    role: row.role,
    emailVerified: row.email_verified,
    twoFactorEnabled: row.two_factor_enabled,
    twoFactorSecret: row.two_factor_secret,
    otpCode: row.otp_code,
    otpExpiry: toNumber(row.otp_expiry),
    resetToken: row.reset_token,
    resetExpiry: toNumber(row.reset_expiry),
    verifyToken: row.verify_token,
    provider: row.provider,
  };
}

async function findOne(query: (db: DatabaseClient) => ReturnType<DatabaseClient>): Promise<User | undefined> {
  await ensureDatabaseSchema();
  const rows = await query(getDb());
  const row = rows[0] as UserRow | undefined;
  return row ? toUser(row) : undefined;
}

export async function findUserByEmail(email: string): Promise<User | undefined> {
  return findOne((db) => db`
    SELECT id, email, password_hash, name, role, email_verified, two_factor_enabled,
      two_factor_secret, otp_code, otp_expiry, reset_token, reset_expiry, verify_token, provider
    FROM users
    WHERE LOWER(email) = LOWER(${email})
    LIMIT 1
  `);
}

export async function findUserById(id: string): Promise<User | undefined> {
  return findOne((db) => db`
    SELECT id, email, password_hash, name, role, email_verified, two_factor_enabled,
      two_factor_secret, otp_code, otp_expiry, reset_token, reset_expiry, verify_token, provider
    FROM users
    WHERE id = ${id}
    LIMIT 1
  `);
}

export async function findUserByResetToken(token: string): Promise<User | undefined> {
  return findOne((db) => db`
    SELECT id, email, password_hash, name, role, email_verified, two_factor_enabled,
      two_factor_secret, otp_code, otp_expiry, reset_token, reset_expiry, verify_token, provider
    FROM users
    WHERE reset_token = ${token} AND reset_expiry > ${Date.now()}
    LIMIT 1
  `);
}

export async function findUserByVerifyToken(token: string): Promise<User | undefined> {
  return findOne((db) => db`
    SELECT id, email, password_hash, name, role, email_verified, two_factor_enabled,
      two_factor_secret, otp_code, otp_expiry, reset_token, reset_expiry, verify_token, provider
    FROM users
    WHERE verify_token = ${token}
    LIMIT 1
  `);
}

export async function createUser(data: Omit<User, "id">): Promise<User> {
  await ensureDatabaseSchema();
  const id = generateId();
  const [row] = await getDb()`
    INSERT INTO users (
      id, email, password_hash, name, role, email_verified, two_factor_enabled,
      two_factor_secret, otp_code, otp_expiry, reset_token, reset_expiry, verify_token, provider
    ) VALUES (
      ${id}, ${data.email.toLowerCase()}, ${data.passwordHash}, ${data.name}, ${data.role},
      ${data.emailVerified}, ${data.twoFactorEnabled}, ${data.twoFactorSecret}, ${data.otpCode},
      ${data.otpExpiry}, ${data.resetToken}, ${data.resetExpiry}, ${data.verifyToken}, ${data.provider}
    )
    RETURNING id, email, password_hash, name, role, email_verified, two_factor_enabled,
      two_factor_secret, otp_code, otp_expiry, reset_token, reset_expiry, verify_token, provider
  `;

  return toUser(row as UserRow);
}

export async function updateUser(
  id: string,
  data: Partial<Omit<User, "id">>,
): Promise<User | undefined> {
  await ensureDatabaseSchema();
  const [row] = await getDb()`
    UPDATE users SET
      email = CASE WHEN ${data.email !== undefined} THEN ${data.email?.toLowerCase() ?? null} ELSE email END,
      password_hash = CASE WHEN ${data.passwordHash !== undefined} THEN ${data.passwordHash ?? null} ELSE password_hash END,
      name = CASE WHEN ${data.name !== undefined} THEN ${data.name ?? null} ELSE name END,
      role = CASE WHEN ${data.role !== undefined} THEN ${data.role ?? null} ELSE role END,
      email_verified = CASE WHEN ${data.emailVerified !== undefined} THEN ${data.emailVerified ?? null} ELSE email_verified END,
      two_factor_enabled = CASE WHEN ${data.twoFactorEnabled !== undefined} THEN ${data.twoFactorEnabled ?? null} ELSE two_factor_enabled END,
      two_factor_secret = CASE WHEN ${data.twoFactorSecret !== undefined} THEN ${data.twoFactorSecret ?? null} ELSE two_factor_secret END,
      otp_code = CASE WHEN ${data.otpCode !== undefined} THEN ${data.otpCode ?? null} ELSE otp_code END,
      otp_expiry = CASE WHEN ${data.otpExpiry !== undefined} THEN ${data.otpExpiry ?? null} ELSE otp_expiry END,
      reset_token = CASE WHEN ${data.resetToken !== undefined} THEN ${data.resetToken ?? null} ELSE reset_token END,
      reset_expiry = CASE WHEN ${data.resetExpiry !== undefined} THEN ${data.resetExpiry ?? null} ELSE reset_expiry END,
      verify_token = CASE WHEN ${data.verifyToken !== undefined} THEN ${data.verifyToken ?? null} ELSE verify_token END,
      provider = CASE WHEN ${data.provider !== undefined} THEN ${data.provider ?? null} ELSE provider END,
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING id, email, password_hash, name, role, email_verified, two_factor_enabled,
      two_factor_secret, otp_code, otp_expiry, reset_token, reset_expiry, verify_token, provider
  `;

  return row ? toUser(row as UserRow) : undefined;
}
