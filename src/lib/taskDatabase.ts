import type { PGlite } from "@electric-sql/pglite";
import type { Task } from "@/types/task";

let db: PGlite | null = null;

export async function initTaskDatabase(task: Task): Promise<PGlite> {
	if (db) {
		await db.close();
		db = null;
	}

	const { PGlite } = await import("@electric-sql/pglite");

	// Create a fresh database instance
	// Using memory mode for better performance and to avoid persistence issues
	db = await PGlite.create({
		dataDir: undefined, // Use in-memory database
	});

	try {
		// Drop existing tables if they exist
		await db.exec(`
			DROP TABLE IF EXISTS order_items CASCADE;
			DROP TABLE IF EXISTS orders CASCADE;
			DROP TABLE IF EXISTS customers CASCADE;
			DROP TABLE IF EXISTS products CASCADE;
			DROP TABLE IF EXISTS categories CASCADE;
		`);
		console.log("Cleaned existing tables");

		await db.exec(task.dbSchema);
		console.log("Schema created successfully");

		await db.exec(task.seedData);
		console.log("Seed data inserted successfully");
	} catch (error) {
		console.error("Database initialization error:", error);
		throw error;
	}

	return db;
}

export async function executeTaskQuery(
	sql: string,
): Promise<{ result: any; error: string | null; executionTime: number }> {
	if (!db) {
		return {
			result: null,
			error: "Database not initialized",
			executionTime: 0,
		};
	}

	const startTime = performance.now();
	try {
		const result = await db.query(sql);
		const executionTime = performance.now() - startTime;
		return {
			result: result.rows,
			error: null,
			executionTime,
		};
	} catch (error: any) {
		const executionTime = performance.now() - startTime;
		return {
			result: null,
			error: error.message || "Query execution failed",
			executionTime,
		};
	}
}

export async function getTaskDatabase(): Promise<PGlite | null> {
	return db;
}

export async function executeQuery(
	sql: string,
): Promise<{ results: any[]; error: string | null; executionTime: number }> {
	if (!db) {
		return {
			results: [],
			error: "Database not initialized",
			executionTime: 0,
		};
	}

	const startTime = performance.now();
	try {
		const result = await db.query(sql);
		const executionTime = performance.now() - startTime;
		return {
			results: result.rows,
			error: null,
			executionTime,
		};
	} catch (error: any) {
		const executionTime = performance.now() - startTime;
		return {
			results: [],
			error: error.message || "Query execution failed",
			executionTime,
		};
	}
}

export async function closeTaskDatabase(): Promise<void> {
	if (db) {
		await db.close();
		db = null;
	}
}
