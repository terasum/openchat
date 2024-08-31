/*
  Warnings:

  - You are about to drop the column `created_at` on the `Settings` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Settings` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Prompt` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Prompt` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `SessionData` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `SessionData` table. All the data in the column will be lost.
  - Added the required column `role` to the `SessionData` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL
);
INSERT INTO "new_Settings" ("id", "key", "value") SELECT "id", "key", "value" FROM "Settings";
DROP TABLE "Settings";
ALTER TABLE "new_Settings" RENAME TO "Settings";
CREATE TABLE "new_Prompt" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "descript" TEXT NOT NULL,
    "prompt" TEXT NOT NULL
);
INSERT INTO "new_Prompt" ("descript", "id", "prompt", "title") SELECT "descript", "id", "prompt", "title" FROM "Prompt";
DROP TABLE "Prompt";
ALTER TABLE "new_Prompt" RENAME TO "Prompt";
CREATE TABLE "new_Session" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL
);
INSERT INTO "new_Session" ("id", "title") SELECT "id", "title" FROM "Session";
DROP TABLE "Session";
ALTER TABLE "new_Session" RENAME TO "Session";
CREATE TABLE "new_SessionData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sessionId" INTEGER NOT NULL,
    "role" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    CONSTRAINT "SessionData_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SessionData" ("id", "message", "sessionId") SELECT "id", "message", "sessionId" FROM "SessionData";
DROP TABLE "SessionData";
ALTER TABLE "new_SessionData" RENAME TO "SessionData";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
