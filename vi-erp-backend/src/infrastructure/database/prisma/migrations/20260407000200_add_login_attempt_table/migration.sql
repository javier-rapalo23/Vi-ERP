-- Agregar tabla LoginAttempt para control de intentos fallidos
CREATE TABLE IF NOT EXISTS "LoginAttempt" (
  "id" SERIAL PRIMARY KEY,
  "userId" INTEGER,
  "email" TEXT NOT NULL,
  "ipAddress" TEXT,
  "success" BOOLEAN NOT NULL,
  "blockedUntil" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "LoginAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "LoginAttempt_email_createdAt_idx" ON "LoginAttempt"("email", "createdAt");
CREATE INDEX IF NOT EXISTS "LoginAttempt_ipAddress_createdAt_idx" ON "LoginAttempt"("ipAddress", "createdAt");
