import type React from "react";
import { useEffect, useState } from "react";
import { executeQuery } from "../lib/database-init";
import ERDiagram from "./ERDiagram";

interface TableSchema {
	tableName: string;
	columns: {
		name: string;
		type: string;
		description?: string;
		primaryKey?: boolean;
		foreignKey?: boolean;
		foreignKeyReference?: {
			table: string;
			column: string;
		};
		unique?: boolean;
		nullable?: boolean;
	}[];
	sampleData: Record<string, string | number | null>[];
}

const DatabaseSchema: React.FC = () => {
	const [tables, setTables] = useState<TableSchema[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		loadDatabaseSchema();
	}, []);

	const loadDatabaseSchema = async () => {
		try {
			// Get all foreign keys from the database
			const foreignKeysResult = await executeQuery(`
				SELECT
					tc.table_name,
					kcu.column_name,
					ccu.table_name AS foreign_table_name,
					ccu.column_name AS foreign_column_name,
					tc.constraint_name
				FROM
					information_schema.table_constraints AS tc
					JOIN information_schema.key_column_usage AS kcu
						ON tc.constraint_name = kcu.constraint_name
						AND tc.table_schema = kcu.table_schema
					JOIN information_schema.constraint_column_usage AS ccu
						ON ccu.constraint_name = tc.constraint_name
						AND ccu.table_schema = tc.table_schema
				WHERE tc.constraint_type = 'FOREIGN KEY'
					AND tc.table_schema = 'public'
				ORDER BY tc.table_name, kcu.column_name
			`);

			// Build a map of foreign keys
			const foreignKeyMap: Record<
				string,
				Record<string, { table: string; column: string }>
			> = {};
			foreignKeysResult.results.forEach((fk) => {
				const tableName = fk.table_name as string;
				const columnName = fk.column_name as string;
				const foreignTable = fk.foreign_table_name as string;
				const foreignColumn = fk.foreign_column_name as string;

				if (!foreignKeyMap[tableName]) {
					foreignKeyMap[tableName] = {};
				}
				foreignKeyMap[tableName][columnName] = {
					table: foreignTable,
					column: foreignColumn,
				};
			});

			// Get all table names
			const tablesResult = await executeQuery(`
				SELECT table_name 
				FROM information_schema.tables 
				WHERE table_schema = 'public' 
				ORDER BY table_name
			`);

			const tableSchemas: TableSchema[] = [];

			for (const tableRow of tablesResult.results) {
				const tableName = tableRow.table_name as string;

				// Get column information with foreign key references
				const columnsResult = await executeQuery(`
					SELECT 
						c.column_name,
						c.data_type,
						c.is_nullable,
						c.column_default,
						CASE 
							WHEN pk.column_name IS NOT NULL THEN true 
							ELSE false 
						END as is_primary_key,
						CASE 
							WHEN fk.column_name IS NOT NULL THEN true 
							ELSE false 
						END as is_foreign_key,
						fk.foreign_table_name,
						fk.foreign_column_name,
						CASE 
							WHEN u.column_name IS NOT NULL THEN true 
							ELSE false 
						END as is_unique
					FROM information_schema.columns c
					LEFT JOIN (
						SELECT kcu.column_name, kcu.table_name
						FROM information_schema.table_constraints tc
						JOIN information_schema.key_column_usage kcu 
							ON tc.constraint_name = kcu.constraint_name
						WHERE tc.constraint_type = 'PRIMARY KEY'
					) pk ON pk.table_name = c.table_name AND pk.column_name = c.column_name
					LEFT JOIN (
						SELECT 
							kcu.column_name, 
							kcu.table_name,
							ccu.table_name AS foreign_table_name,
							ccu.column_name AS foreign_column_name
						FROM information_schema.table_constraints tc
						JOIN information_schema.key_column_usage kcu 
							ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
						JOIN information_schema.constraint_column_usage ccu 
							ON ccu.constraint_name = tc.constraint_name AND ccu.table_schema = tc.table_schema
						WHERE tc.constraint_type = 'FOREIGN KEY'
					) fk ON fk.table_name = c.table_name AND fk.column_name = c.column_name
					LEFT JOIN (
						SELECT kcu.column_name, kcu.table_name
						FROM information_schema.table_constraints tc
						JOIN information_schema.key_column_usage kcu 
							ON tc.constraint_name = kcu.constraint_name
						WHERE tc.constraint_type = 'UNIQUE'
					) u ON u.table_name = c.table_name AND u.column_name = c.column_name
					WHERE c.table_name = '${tableName}'
					ORDER BY c.ordinal_position
				`);

				// Get sample data (limit 5 rows)
				const sampleResult = await executeQuery(
					`SELECT * FROM ${tableName} LIMIT 5`,
				);

				const columns = columnsResult.results.map((col) => {
					const columnName = col.column_name as string;

					// Check if this column is a foreign key using our manual map
					const tableFKs = foreignKeyMap[tableName];
					const foreignKeyRef = tableFKs?.[columnName];

					return {
						name: columnName,
						type: col.data_type as string,
						primaryKey: col.is_primary_key as boolean,
						foreignKey: !!foreignKeyRef,
						foreignKeyReference: foreignKeyRef,
						unique: col.is_unique as boolean,
						nullable: col.is_nullable === "YES",
					};
				});

				tableSchemas.push({
					tableName,
					columns,
					sampleData: sampleResult.results,
				});
			}

			setTables(tableSchemas);
		} catch (error) {
			console.error("Failed to load database schema:", error);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-full">
				<p>Loading database schema...</p>
			</div>
		);
	}

	return <ERDiagram tables={tables} />;
};

export default DatabaseSchema;
