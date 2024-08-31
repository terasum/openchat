/*
  Warnings:

  - You are about to drop the column `update_time` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `SessionData` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "role_id" INTEGER NOT NULL,
    "type" TEXT NOT NULL
);
INSERT INTO "new_Session" ("id", "role_id", "title", "type") SELECT "id", "role_id", "title", "type" FROM "Session";
DROP TABLE "Session";
ALTER TABLE "new_Session" RENAME TO "Session";
CREATE TABLE "new_SessionData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sessionId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "is_ask" BOOLEAN NOT NULL,
    "is_memory" BOOLEAN NOT NULL,
    "message_type" TEXT NOT NULL,
    "model" TEXT NOT NULL
);
INSERT INTO "new_SessionData" ("id", "is_ask", "is_memory", "message", "message_type", "model", "role", "sessionId") SELECT "id", "is_ask", "is_memory", "message", "message_type", "model", "role", "sessionId" FROM "SessionData";
DROP TABLE "SessionData";
ALTER TABLE "new_SessionData" RENAME TO "SessionData";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
