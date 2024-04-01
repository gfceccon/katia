import { JSONFilePreset } from "lowdb/node";
import { Low } from "lowdb";
import { existsSync } from "fs";

export async function loadDatabase<T>(
  fileName: string,
  defaultValue: T
): Promise<Low<T>> {
  return JSONFilePreset(`${process.env.DB_PATH}/${fileName}`, defaultValue);
}

export const exists = (fileName: string): boolean => {
  return existsSync(`${process.env.DB_PATH}/${fileName}`);
};
