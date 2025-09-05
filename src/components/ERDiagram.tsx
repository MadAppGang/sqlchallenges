import {
	Background,
	ConnectionMode,
	Controls,
	type Edge,
	type Node,
	Panel,
	ReactFlow,
	Handle,
	Position,
	useEdgesState,
	useNodesState,
} from "@xyflow/react";
import type React from "react";
import { useCallback, useMemo, useEffect, useState } from "react";
import "@xyflow/react/dist/style.css";
import dagre from "dagre";
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
		<div className="relative" style={{ width: '260px', zIndex: 10 }}>
			{/* Connection handles for React Flow */}
			<Handle
				type="target"
				position={Position.Left}
				id="left"
				style={{ background: '#6366f1', width: '10px', height: '10px' }}
			/>
			<Handle
				type="source"
				position={Position.Right}
				id="right"
				style={{ background: '#6366f1', width: '10px', height: '10px' }}
			/>
			<Handle
				type="target"
				position={Position.Top}
				id="top"
				style={{ background: '#6366f1', width: '10px', height: '10px' }}
			/>
			<Handle
				type="source"
				position={Position.Bottom}
				id="bottom"
				style={{ background: '#6366f1', width: '10px', height: '10px' }}
			/>
			
			<div className="border border-gray-400 rounded-md shadow-md overflow-hidden bg-white">
				{/* Table Header - Black background */}
				<div className="px-4 py-3 flex items-center gap-2" style={{ backgroundColor: '#000000', color: '#ffffff' }}>
					<Database className="w-4 h-4" style={{ color: '#9CA3AF' }} />
					<span className="font-medium text-sm" style={{ color: '#ffffff' }}>{table.tableName}</span>
				</div>

				{/* Columns - Solid white background */}
				<div className="bg-white" style={{ backgroundColor: '#ffffff' }}>
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
								className="px-3 py-2 flex items-center gap-2 bg-white hover:bg-gray-50 transition-colors border-b border-gray-200 last:border-b-0"
							>
								{/* Icons */}
								<div className="flex items-center gap-0.5">
									{isPrimaryKey && <Key className="w-3.5 h-3.5 text-gray-600" />}
									{isForeignKey && !isPrimaryKey && (
										<Link2 className="w-3.5 h-3.5 text-gray-600" />
									)}
									{isNullable ? (
										<Circle className="w-3 h-3 text-gray-400" />
									) : (
										<CircleDot className="w-3 h-3 text-gray-700 fill-gray-700" />
									)}
									{(isPrimaryKey || isForeignKey) && (
										<Hash className="w-3.5 h-3.5 text-gray-500" />
									)}
								</div>

								{/* Column name */}
								<span className="flex-1 font-mono text-xs text-gray-800">
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
		</div>
	);
};

const ERDiagram: React.FC<ERDiagramProps> = ({ tables }) => {
	// Memoize nodeTypes to prevent React Flow warnings
	const nodeTypes = useMemo(() => ({
		table: TableNode,
	}), []);
	// Generate nodes and edges from table data
	const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
		const nodes: Node[] = [];
		const edges: Edge[] = [];

		// Create a dagre graph for layout
		const dagreGraph = new dagre.graphlib.Graph();
		dagreGraph.setDefaultEdgeLabel(() => ({}));
		
		// Configure the layout
		dagreGraph.setGraph({
			rankdir: "TB", // Top to bottom layout
			align: "UL",
			nodesep: 100, // Horizontal spacing between nodes
			ranksep: 100, // Vertical spacing between ranks
			marginx: 50,
			marginy: 50,
		});

		// Add nodes to dagre graph with dimensions
		const nodeWidth = 260;
		const nodeHeight = 200; // Approximate height for tables
		
		tables.forEach((table) => {
			dagreGraph.setNode(table.tableName, { 
				width: nodeWidth, 
				height: nodeHeight 
			});
		});

		// Add edges to dagre graph based on foreign keys
		const edgeSet = new Set<string>();
		tables.forEach((table) => {
			table.columns.forEach((column) => {
				if (column.foreignKey && column.foreignKeyReference) {
					const referencedTable = column.foreignKeyReference.table;
					if (tables.some((t) => t.tableName === referencedTable)) {
						const edgeKey = `${referencedTable}-${table.tableName}`;
						if (!edgeSet.has(edgeKey)) {
							dagreGraph.setEdge(referencedTable, table.tableName);
							edgeSet.add(edgeKey);
						}
					}
				}
			});
		});

		// Calculate the layout
		dagre.layout(dagreGraph);

		// Create React Flow nodes from dagre layout
		const nodePositionsMap = new Map<string, { x: number; y: number }>();
		
		tables.forEach((table) => {
			const nodeWithPosition = dagreGraph.node(table.tableName);
			const position = {
				x: nodeWithPosition.x - nodeWidth / 2,
				y: nodeWithPosition.y - nodeHeight / 2,
			};
			
			nodes.push({
				id: table.tableName,
				type: "table",
				position,
				data: { table },
				draggable: true,
			});
			
			// Store actual center position for edge routing
			nodePositionsMap.set(table.tableName, {
				x: nodeWithPosition.x,
				y: nodeWithPosition.y
			});
		});

		// Create edges based on foreign key relationships from the database
		tables.forEach((table) => {
			table.columns.forEach((column) => {
				// Use the foreign key reference from the database query
				if (column.foreignKey && column.foreignKeyReference) {
					const referencedTable = column.foreignKeyReference.table;
					
					// Create edge if referenced table exists in our tables
					if (tables.some((t) => t.tableName === referencedTable)) {
						const edgeId = `${table.tableName}-${referencedTable}-${column.name}`;

						// Avoid duplicate edges
						if (!edges.some((edge) => edge.id === edgeId)) {
							// Get positions to determine best handles
							const sourcePos = nodePositionsMap.get(referencedTable);
							const targetPos = nodePositionsMap.get(table.tableName);
							
							let sourceHandle = "bottom";
							let targetHandle = "top";
							
							if (sourcePos && targetPos) {
								const dx = targetPos.x - sourcePos.x;
								const dy = targetPos.y - sourcePos.y;
								
								// Choose handles based on relative positions
								// Dagre usually arranges nodes vertically, so prefer vertical connections
								if (Math.abs(dx) > Math.abs(dy) * 2) {
									// Strongly horizontal - use left/right
									if (dx > 0) {
										sourceHandle = "right";
										targetHandle = "left";
									} else {
										sourceHandle = "left";
										targetHandle = "right";
									}
								} else {
									// Vertical or diagonal - use top/bottom
									if (dy > 0) {
										sourceHandle = "bottom";
										targetHandle = "top";
									} else {
										sourceHandle = "top";
										targetHandle = "bottom";
									}
								}
							}
							
							const edge = {
								id: edgeId,
								source: referencedTable,
								sourceHandle,
								target: table.tableName,
								targetHandle,
								type: "smoothstep",
								animated: false,
								style: { 
									stroke: "#6366f1", 
									strokeWidth: 2,
								},
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
								},
								labelBgStyle: {
									fill: "#ffffff",
									fillOpacity: 0.9,
								},
							};
							
							edges.push(edge);
						}
					}
				}
			});
		});
		
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
						fitViewOptions={{ padding: 0.05, minZoom: 0.5, maxZoom: 2 }}
						minZoom={0.3}
						maxZoom={2.5}
						defaultViewport={{ x: 0, y: 0, zoom: 0.75 }}
					>
						<Background color="#f3f4f6" gap={16} />
						<Controls showInteractive={false} />
						<Panel
							position="bottom-left"
							className="bg-white/95 backdrop-blur border border-gray-300 rounded-lg p-3 text-xs shadow-lg"
						>
							<div className="space-y-2">
								<div className="flex items-center gap-2">
									<Key className="w-3.5 h-3.5 text-gray-700" />
									<span className="text-gray-700">Primary Key</span>
								</div>
								<div className="flex items-center gap-2">
									<Link2 className="w-3.5 h-3.5 text-gray-700" />
									<span className="text-gray-700">Foreign Key</span>
								</div>
								<div className="flex items-center gap-2">
									<Hash className="w-3.5 h-3.5 text-gray-600" />
									<span className="text-gray-700">Identity</span>
								</div>
								<div className="flex items-center gap-2">
									<Circle className="w-3.5 h-3.5 text-gray-400" />
									<span className="text-gray-700">Nullable</span>
								</div>
								<div className="flex items-center gap-2">
									<CircleDot className="w-3.5 h-3.5 text-gray-700 fill-gray-700" />
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
