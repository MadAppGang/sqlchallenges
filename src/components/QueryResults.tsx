import {
	AlertCircle,
	CheckCircle,
	ChevronDown,
	ChevronUp,
	Terminal,
} from "lucide-react";
import React, { useEffect, useRef } from "react";
import { Alert, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface QueryExecution {
	id: string;
	query: string;
	result: any;
	error: string | null;
	executionTime: number;
	timestamp: Date;
}

interface QueryResultsProps {
	queryHistory: QueryExecution[];
}

export const QueryResults: React.FC<QueryResultsProps> = ({ queryHistory }) => {
	const scrollRef = useRef<HTMLDivElement>(null);
	const [collapsedQueries, setCollapsedQueries] = React.useState<Set<string>>(
		new Set(),
	);

	// Auto-scroll to bottom when new query is added
	useEffect(() => {
		if (scrollRef.current && queryHistory.length > 0) {
			// Collapse all previous queries except the first one (which is the latest)
			const allButFirst = queryHistory.slice(1).map((q) => q.id);
			setCollapsedQueries(new Set(allButFirst));

			setTimeout(() => {
				if (scrollRef.current) {
					scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
				}
			}, 100);
		}
	}, [queryHistory]);

	const toggleCollapse = (id: string) => {
		setCollapsedQueries((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(id)) {
				newSet.delete(id);
			} else {
				newSet.add(id);
			}
			return newSet;
		});
	};

	if (queryHistory.length === 0) {
		return (
			<Card className="h-full flex flex-col">
				<CardHeader className="pb-3 flex-shrink-0">
					<CardTitle className="text-base">Query Results</CardTitle>
				</CardHeader>
				<CardContent className="flex-1 flex items-center justify-center">
					<div className="text-center text-muted-foreground">
						<Terminal className="w-12 h-12 mx-auto mb-3 text-gray-300" />
						<p className="text-sm">Run a query to see results here</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="h-full flex flex-col">
			<CardHeader className="pb-3 flex-shrink-0 border-b">
				<div className="flex items-center justify-between">
					<CardTitle className="text-base">Query Results</CardTitle>
					<span className="text-xs text-muted-foreground">
						{queryHistory.length}{" "}
						{queryHistory.length === 1 ? "query" : "queries"} executed
					</span>
				</div>
			</CardHeader>
			<div className="flex-1 overflow-y-auto" ref={scrollRef}>
				<div className="p-4 space-y-4">
					{queryHistory.map((execution, index) => {
						const isCollapsed = collapsedQueries.has(execution.id);
						const isLatest = index === 0; // First item is the latest
						const queryNumber = queryHistory.length - index;

						return (
							<div
								key={execution.id}
								className={`border rounded-lg overflow-hidden bg-card ${
									isLatest ? "ring-2 ring-primary/30 shadow-sm" : ""
								}`}
							>
								{/* Query Header */}
								<div
									className={`px-3 py-2 bg-muted/40 flex items-center justify-between cursor-pointer hover:bg-muted/60 transition-colors`}
									onClick={() => toggleCollapse(execution.id)}
								>
									<div className="flex items-center gap-2 flex-1 min-w-0">
										{execution.error ? (
											<AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
										) : (
											<CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
										)}
										<span className="font-mono text-sm font-semibold text-muted-foreground">
											{queryNumber}:
										</span>
										<code className="text-sm font-mono truncate flex-1">
											{execution.query}
										</code>
									</div>
									<div className="flex items-center gap-2 flex-shrink-0">
										{isLatest && (
											<span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
												Latest
											</span>
										)}
										<span className="text-xs text-muted-foreground">
											{new Date(execution.timestamp).toLocaleTimeString()}
										</span>
										<Button variant="ghost" size="sm" className="h-6 w-6 p-0">
											{isCollapsed ? (
												<ChevronDown className="w-4 h-4" />
											) : (
												<ChevronUp className="w-4 h-4" />
											)}
										</Button>
									</div>
								</div>

								{/* Query Content */}
								{!isCollapsed && (
									<>
										{/* Results */}
										<div className="max-h-72 overflow-auto">
											{execution.error ? (
												<div className="p-3">
													<Alert variant="destructive" className="mb-0">
														<AlertCircle className="h-4 w-4" />
														<AlertDescription>
															{execution.error}
														</AlertDescription>
													</Alert>
												</div>
											) : execution.result && execution.result.length > 0 ? (
												<div className="overflow-x-auto">
													<table className="w-full text-xs">
														<thead className="bg-muted/30 sticky top-0">
															<tr>
																{Object.keys(execution.result[0]).map((col) => (
																	<th
																		key={col}
																		className="px-3 py-1.5 text-left font-medium text-muted-foreground uppercase tracking-wider border-b"
																	>
																		{col}
																	</th>
																))}
															</tr>
														</thead>
														<tbody className="divide-y divide-border">
															{execution.result
																.slice(0, 10)
																.map((row: any, idx: number) => (
																	<tr key={idx} className="hover:bg-muted/20">
																		{Object.keys(row).map((col) => (
																			<td key={col} className="px-3 py-1.5">
																				{row[col] !== null ? (
																					String(row[col])
																				) : (
																					<span className="text-muted-foreground italic">
																						NULL
																					</span>
																				)}
																			</td>
																		))}
																	</tr>
																))}
															{execution.result.length > 10 && (
																<tr>
																	<td
																		colSpan={
																			Object.keys(execution.result[0]).length
																		}
																		className="px-3 py-2 text-center text-muted-foreground bg-muted/20"
																	>
																		... and {execution.result.length - 10} more
																		rows
																	</td>
																</tr>
															)}
														</tbody>
													</table>
												</div>
											) : (
												<div className="p-3 text-sm text-muted-foreground text-center">
													Query executed successfully but returned no rows
												</div>
											)}
										</div>

										{/* Stats Footer */}
										<div className="px-3 py-1.5 bg-muted/30 border-t flex items-center justify-between text-xs text-muted-foreground">
											<div className="flex items-center gap-3">
												{execution.result && (
													<span>{execution.result.length} rows returned</span>
												)}
												<span>
													Execution time: {execution.executionTime.toFixed(2)}ms
												</span>
											</div>
										</div>
									</>
								)}
							</div>
						);
					})}
				</div>
			</div>
		</Card>
	);
};
