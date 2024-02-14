import { PersonDb } from "@/types/person";
import Dexie, { Table } from "dexie";

export class DB extends Dexie {
  persons!: Table<PersonDb>;
  constructor() {
    super("database");
    this.version(1).stores({
      persons: "++id, email, fname, lname",
    });
  }
}

export const db = new DB();
