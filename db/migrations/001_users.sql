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
);

CREATE INDEX IF NOT EXISTS users_reset_token_idx ON users (reset_token);
CREATE INDEX IF NOT EXISTS users_verify_token_idx ON users (verify_token);
