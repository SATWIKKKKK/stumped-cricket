import { neon } from "@neondatabase/serverless";

export function getNeonSql() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    return null;
  }
  return neon(url);
}
