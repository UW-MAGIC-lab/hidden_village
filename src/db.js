import Dexie from "dexie";
import "dexie-export-import";

Dexie.delete("THV-O");
const db = new Dexie("THV-O");
db.version(1).stores({
  events: "++id, &timestamp, eventType, conjecture, payload", // Primary key and indexed props
});

export default db;
