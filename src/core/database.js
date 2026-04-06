import { existsSync, readFileSync, writeFileSync } from 'fs';

const DB_FILE = "db.json";

export function loadDB() {
    if (!existsSync(DB_FILE)) {
        return { placares: {}, lastUpdate: 0 };
    }
    return JSON.parse(readFileSync(DB_FILE));
}

export function saveDB(data) {
    writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}