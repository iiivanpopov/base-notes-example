import { pool } from "../src/database/pool.js";

pool
	.query(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL
  );
`)
	.catch((error) => {
		console.error("A migration error occurred.");
		console.error(error);
	})
	.finally(() => {
		console.log("Migration completed successfully!");
	});
