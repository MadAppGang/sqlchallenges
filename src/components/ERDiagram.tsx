import {
	Background,
	ConnectionMode,
	Controls,
	type Edge,
	type Node,
	Panel,
	ReactFlow,
	useEdgesState,
	useNodesState,
} from "@xyflow/react";
import type React from "react";
import { useCallback, useMemo } from "react";
import "@xyflow/react/dist/style.css";
import {
	Database,
	Key,
	Link2,
	Hash,
	Diamond,
	Circle,
	CircleDot,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

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

interface ERDiagramProps {
	tables: TableSchema[];
}

// Custom Table Node Component
const TableNode = ({ data }: { data: { table: TableSchema } }) => {
	const { table } = data;

	const detectColumnAttributes = (column: TableSchema["columns"][0], tableName: string) => {
		const isPrimaryKey =
			column.primaryKey ||
			column.name.toLowerCase() === "id" ||
			column.description?.toLowerCase().includes("primary key");

		// A column ending with _id is a foreign key ONLY if it's not the primary key of its own table
		// For example: category_id in categories table is a PK, not FK
		// But category_id in products table is a FK
		const columnBaseName = column.name.replace(/_id$/, "");
		const tableBaseName = tableName.replace(/s$/, ""); // Remove plural 's'
		
		const isForeignKey =
			column.foreignKey ||
			(column.name.endsWith("_id") && 
			 !isPrimaryKey && 
			 columnBaseName !== tableBaseName) ||
			column.description?.toLowerCase().includes("foreign key");

		const isUnique =
			column.unique || column.description?.toLowerCase().includes("unique");

		const isNullable =
			column.nullable !== false &&
			!isPrimaryKey &&
			!column.description?.toLowerCase().includes("not null");

		return { isPrimaryKey, isForeignKey, isUnique, isNullable };
	};

	return (
		<div className="bg-white border border-gray-300 rounded-lg shadow-sm w-72 overflow-hidden">
			{/* Table Header */}
			<div className="bg-gray-900 text-white px-3 py-2 flex items-center gap-2">
				<Database className="w-4 h-4" />
				<span className="font-medium text-sm">{table.tableName}</span>
			</div>

			{/* Columns */}
			<div className="divide-y divide-gray-200">
				{table.columns.map((column, index) => {
					const { isPrimaryKey, isForeignKey, isUnique, isNullable } =
						detectColumnAttributes(column, table.tableName);

					const typeDisplay = column.type
						.replace(/character varying(\(\d+\))?/gi, "varchar")
						.replace(/character(\(\d+\))?/gi, "char")
						.replace(/integer/gi, "int")
						.replace(/numeric(\([\d,]+\))?/gi, "decimal")
						.replace(/text/gi, "text")
						.replace(/timestamp with time zone/gi, "timestamptz")
						.replace(/timestamp without time zone/gi, "timestamp")
						.replace(/timestamp/gi, "timestamp")
						.replace(/boolean/gi, "bool")
						.replace(/date/gi, "date")
						.replace(/\(.*\)/g, ""); // Remove any remaining parentheses

					return (
						<div
							key={index}
							className="px-3 py-2 flex items-center gap-2 hover:bg-gray-50 transition-colors"
						>
							{/* Icons */}
							<div className="flex items-center gap-0.5 min-w-[40px]">
								{isPrimaryKey && <Key className="w-3.5 h-3.5 text-amber-600" />}
								{isForeignKey && !isPrimaryKey && (
									<Link2 className="w-3.5 h-3.5 text-blue-600" />
								)}
								{/* Show # for ID fields */}
								{(isPrimaryKey || isForeignKey) && (
									<Hash className="w-3.5 h-3.5 text-gray-500" />
								)}
								{isNullable ? (
									<Circle className="w-3 h-3 text-gray-400" />
								) : (
									<CircleDot className="w-3 h-3 text-gray-700" />
								)}
							</div>

							{/* Column name */}
							<span className="flex-1 font-mono text-sm text-gray-800">
								{column.name}
							</span>

							{/* Data type */}
							<span className="text-xs text-gray-500 font-mono">
								{typeDisplay}
							</span>
						</div>
					);
				})}
			</div>
		</div>
	);
};

const nodeTypes = {
	table: TableNode,
};

const ERDiagram: React.FC<ERDiagramProps> = ({ tables }) => {
	// Generate nodes and edges from table data
	const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
		const nodes: Node[] = [];
		const edges: Edge[] = [];

		// Create nodes for each table with improved positioning
		const tableCount = tables.length;
		const cols = Math.min(3, Math.ceil(Math.sqrt(tableCount))); // Max 3 columns for better layout
		const _rows = Math.ceil(tableCount / cols);

		tables.forEach((table, index) => {
			const col = index % cols;
			const row = Math.floor(index / cols);

			nodes.push({
				id: table.tableName,
				type: "table",
				position: {
					x: col * 320 + 50, // Increased spacing between columns
					y: row * 350 + 50, // Increased spacing between rows
				},
				data: { table },
				draggable: true,
			});
		});

		// Create edges based on foreign key relationships from the database
		tables.forEach((table) => {
			table.columns.forEach((column) => {
				// Use the foreign key reference from the database query
				if (column.foreignKey && column.foreignKeyReference) {
					const referencedTable = column.foreignKeyReference.table;
					console.log(`Creating edge: ${table.tableName}.${column.name} -> ${referencedTable}`);
					
					// Create edge if referenced table exists in our tables
					if (tables.some((t) => t.tableName === referencedTable)) {
						const edgeId = `${table.tableName}-${referencedTable}-${column.name}`;

						// Avoid duplicate edges
						if (!edges.some((edge) => edge.id === edgeId)) {
							edges.push({
								id: edgeId,
								source: referencedTable,
								target: table.tableName,
								type: "smoothstep",
								animated: false,
								style: { stroke: "#6366f1", strokeWidth: 2 },
								markerEnd: {
									type: "arrowclosed",
									color: "#6366f1",
									width: 20,
									height: 20,
								},
								label: column.name,
								labelStyle: {
									fontSize: "11px",
									fontWeight: 500,
									fill: "#6366f1",
									background: "#ffffff",
									padding: "2px 4px",
									borderRadius: "3px",
								},
							});
						}
					}
				}
			});
		});
		
		console.log("Total edges created:", edges.length, edges);
		return { nodes, edges };
	}, [tables]);

	const [nodes, _setNodes, onNodesChange] = useNodesState(initialNodes);
	const [edges, _setEdges, onEdgesChange] = useEdgesState(initialEdges);

	const onConnect = useCallback((_params: unknown) => {
		// Prevent manual connections
	}, []);

	return (
		<Card className="h-full flex flex-col">
			<CardHeader className="pb-4 flex-shrink-0">
				<CardTitle className="text-lg flex items-center gap-2">
					<Database className="w-5 h-5" />
					Entity Relationship Diagram
				</CardTitle>
			</CardHeader>
			<CardContent className="flex-1 p-0">
				<div className="h-full w-full">
					<ReactFlow
						nodes={nodes}
						edges={edges}
						onNodesChange={onNodesChange}
						onEdgesChange={onEdgesChange}
						onConnect={onConnect}
						nodeTypes={nodeTypes}
						connectionMode={ConnectionMode.Loose}
						fitView
						fitViewOptions={{ padding: 0.1, minZoom: 0.3, maxZoom: 1.5 }}
						minZoom={0.2}
						maxZoom={2.0}
						defaultViewport={{ x: 0, y: 0, zoom: 0.6 }}
					>
						<Background />
						<Controls showInteractive={false} />
						<Panel
							position="bottom-left"
							className="bg-white border border-gray-300 rounded-lg p-3 text-xs shadow-sm"
						>
							<div className="space-y-2">
								<div className="flex items-center gap-2">
									<Key className="w-3.5 h-3.5 text-amber-600" />
									<span className="text-gray-700">Primary Key</span>
								</div>
								<div className="flex items-center gap-2">
									<Link2 className="w-3.5 h-3.5 text-blue-600" />
									<span className="text-gray-700">Foreign Key</span>
								</div>
								<div className="flex items-center gap-2">
									<Hash className="w-3.5 h-3.5 text-gray-500" />
									<span className="text-gray-700">Identity</span>
								</div>
								<div className="flex items-center gap-2">
									<Circle className="w-3 h-3 text-gray-400" />
									<span className="text-gray-700">Nullable</span>
								</div>
								<div className="flex items-center gap-2">
									<CircleDot className="w-3 h-3 text-gray-700" />
									<span className="text-gray-700">Non-Nullable</span>
								</div>
							</div>
						</Panel>
					</ReactFlow>
				</div>
			</CardContent>
		</Card>
	);
};

export default ERDiagram;
