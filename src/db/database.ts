import { config } from "dotenv";
import sqlite3 from "sqlite3";
import mysql from "mysql2/promise";
import { Pool as PgPool } from "pg";
import sql from "mssql";

config();

const DB_TYPE = process.env.DB_TYPE || "sqlite";

export let db: any;

async function connectDatabase() {
    if (DB_TYPE === "sqlite") {
        const sqlite = new sqlite3.Database(process.env.SQLITE_FILE || "attendance.db");
        db = {
            query: (query: string, values?: any[]) =>
                new Promise((resolve, reject) =>
                    sqlite.all(query, values, (err, rows) => (err ? reject(err) : resolve(rows)))
                ),
            close: () => Promise.resolve(),
        };

        // ✅ Create the attendance table if it does not exist
        sqlite.run(`
            CREATE TABLE IF NOT EXISTS attendance (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                device_id TEXT NOT NULL,
                device_type TEXT NOT NULL,
                employee_id TEXT NOT NULL,
                punch_time TEXT NOT NULL,
                punch_type TEXT NOT NULL,
                synced BOOLEAN DEFAULT FALSE
            );
        `, (err) => {
            if (err) console.error("Error creating SQLite table:", err);
            else console.log("✅ SQLite: 'attendance' table ensured.");
        });

    } else if (DB_TYPE === "mysql") {
        db = await mysql.createConnection({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
        });

        // ✅ Create the attendance table if it does not exist
        await db.query(`
            CREATE TABLE IF NOT EXISTS attendance (
                id INT AUTO_INCREMENT PRIMARY KEY,
                device_id VARCHAR(255) NOT NULL,
                device_type VARCHAR(255) NOT NULL,
                employee_id VARCHAR(255) NOT NULL,
                punch_time DATETIME NOT NULL,
                punch_type VARCHAR(50) NOT NULL,
                synced BOOLEAN DEFAULT FALSE
            );
        `);
        console.log("✅ MySQL: 'attendance' table ensured.");

    } else if (DB_TYPE === "postgres") {
        const pool = new PgPool({
            host: process.env.PG_HOST,
            user: process.env.PG_USER,
            password: process.env.PG_PASSWORD,
            database: process.env.PG_DATABASE,
        });
        db = {
            query: (query: string, values?: any[]) => pool.query(query, values).then((res) => res.rows),
            close: () => pool.end(),
        };

        // ✅ Create the attendance table if it does not exist
        await db.query(`
            CREATE TABLE IF NOT EXISTS attendance (
                id SERIAL PRIMARY KEY,
                device_id TEXT NOT NULL,
                device_type TEXT NOT NULL,
                employee_id TEXT NOT NULL,
                punch_time TIMESTAMP NOT NULL,
                punch_type TEXT NOT NULL,
                synced BOOLEAN DEFAULT FALSE
            );
        `);
        console.log("✅ PostgreSQL: 'attendance' table ensured.");

    } else if (DB_TYPE === "mssql") {
        const pool = await sql.connect({
            user: process.env.MSSQL_USER,
            password: process.env.MSSQL_PASSWORD,
            server: process.env.MSSQL_HOST!,
            database: process.env.MSSQL_DATABASE!,
            options: { trustServerCertificate: true },
        });
        db = {
            query: (query: string, values?: any[]) => pool.request().query(query),
            close: () => pool.close(),
        };

        // ✅ Create the attendance table if it does not exist
        await db.query(`
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='attendance' AND xtype='U')
            CREATE TABLE attendance (
                id INT IDENTITY PRIMARY KEY,
                device_id NVARCHAR(255) NOT NULL,
                device_type NVARCHAR(255) NOT NULL,
                employee_id NVARCHAR(255) NOT NULL,
                punch_time DATETIME NOT NULL,
                punch_type NVARCHAR(50) NOT NULL,
                synced BIT DEFAULT 0
            );
        `);
        console.log("✅ MSSQL: 'attendance' table ensured.");
    }
}

export { connectDatabase };
