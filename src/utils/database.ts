
import sqlite from "sqlite3";

const db = new sqlite.Database("./data");

// Create first
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS account (
        id INTEGER PRIMARY KEY NOT NULL,
        username VARCHAR(100) UNIQUE NOT NULL,
        auth_hash VARCHAR(500) NOT NULL,
        role VARCHAR(50) DEFAULT NULL
    )`)
});

type QueryValues = (string | number)[] | string | number;

export async function query<T, C extends keyof T = keyof T>(queryString: string, values: QueryValues = []) {
    try {
        // const results = await db.query<Pick<T, C>[]>(queryString, values);
        // await db.end();
        const results: Pick<T, C>[] = await new Promise((resolve, reject) => {
            db.serialize(() => {
                db.all(queryString, values, (err, rows) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    resolve(rows)
                })
            })
        });
        return results;
    }
    catch (err) {
        throw err;
    }
}

export function toSerializableObject(queryResult: Object) {
    return JSON.parse(JSON.stringify(queryResult));
}
