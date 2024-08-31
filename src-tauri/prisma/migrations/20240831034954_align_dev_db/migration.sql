/*
  Warnings:

  - The primary key for the `Session` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `role_id` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `update_time` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is_ask` to the `SessionData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is_memory` to the `SessionData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `message_type` to the `SessionData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `model` to the `SessionData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time` to the `SessionData` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "role_id" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "update_time" BIGINT NOT NULL
);
INSERT INTO "new_Session" ("id", "title") SELECT "id", "title" FROM "Session";
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
    "model" TEXT NOT NULL,
    "time" BIGINT NOT NULL
);
INSERT INTO "new_SessionData" ("id", "message", "role", "sessionId") SELECT "id", "message", "role", "sessionId" FROM "SessionData";
DROP TABLE "SessionData";
ALTER TABLE "new_SessionData" RENAME TO "SessionData";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
