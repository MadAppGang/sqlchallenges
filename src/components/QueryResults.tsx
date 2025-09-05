import { AlertCircle, CheckCircle, ChevronDown, ChevronRight, Clock, Database, Hash } from "lucide-react";
import type React from "react";
import { useState, useEffect, useRef } from "react";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "./ui/table";

export interface QueryResult {
	id: string;
	query: string;
	results: Record<string, string | number | null>[];
	error?: string;
	executionTime?: number;
	timestamp: Date;
}

interface QueryResultsProps {
	queryHistory: QueryResult[];
	isLoading?: boolean;
	currentQuery?: string;
}

const QueryResultItem: React.FC<{ 
	result: QueryResult; 
	index: number;
	isLatest: boolean;
}> = ({ result, index, isLatest }) => {
	const [isExpanded, setIsExpanded] = useState(isLatest);

	const getStatusIcon = () => {
		if (result.error) return <AlertCircle className="w-4 h-4 text-red-500" />;
		if (result.results.length > 0)
			return <CheckCircle className="w-4 h-4 text-green-500" />;
		return <Database className="w-4 h-4 text-gray-500" />;
	};

	const getStatusText = () => {
		if (result.error) return "Error";
		if (result.results.length > 0)
			return `${result.results.length} row${result.results.length !== 1 ? "s" : ""}`;
		return "No results";
	};

	const getStatusColor = () => {
		if (result.error) return "bg-red-100 text-red-800";
		if (result.results.length > 0) return "bg-green-100 text-green-800";
		return "bg-gray-100 text-gray-800";
	};

	const formatTime = (date: Date) => {
		return date.toLocaleTimeString("en-US", {
			hour12: false,
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
		});
	};

	const truncateQuery = (query: string, maxLength: number = 100) => {
		const singleLine = query.replace(/\s+/g, " ").trim();
		if (singleLine.length <= maxLength) return singleLine;
		return singleLine.substring(0, maxLength) + "...";
	};

	return (
		<div className={`border rounded-lg ${isLatest ? 'border-blue-300 bg-blue-50/50' : 'border-border'} mb-3`}>
			<div 
				className="flex items-start gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors"
				onClick={() => setIsExpanded(!isExpanded)}
			>
				<Button
					variant="ghost"
					size="sm"
					className="p-0 h-5 w-5"
					onClick={(e) => {
						e.stopPropagation();
						setIsExpanded(!isExpanded);
					}}
				>
					{isExpanded ? (
						<ChevronDown className="h-4 w-4" />
					) : (
						<ChevronRight className="h-4 w-4" />
					)}
				</Button>

				<div className="flex-1 min-w-0">
					<div className="flex items-start justify-between gap-2 mb-2">
						<div className="flex items-center gap-2">
							<Badge variant="outline" className="text-xs">
								<Hash className="w-3 h-3 mr-1" />
								{index + 1}
							</Badge>
							<Badge variant="secondary" className={getStatusColor()}>
								<div className="flex items-center gap-1">
									{getStatusIcon()}
									{getStatusText()}
								</div>
							</Badge>
							{result.executionTime && (
								<span className="text-xs text-muted-foreground">
									{result.executionTime}ms
								</span>
							)}
							<span className="text-xs text-muted-foreground">
								{formatTime(result.timestamp)}
							</span>
							{isLatest && (
								<Badge variant="default" className="text-xs">
									Latest
								</Badge>
							)}
						</div>
					</div>
					<div className="font-mono text-sm text-muted-foreground">
						{truncateQuery(result.query)}
					</div>
				</div>
			</div>

			{isExpanded && (
				<div className="border-t border-border">
					<div className="p-4 bg-muted/30">
						<div className="font-mono text-xs text-muted-foreground mb-3 whitespace-pre-wrap bg-background p-3 rounded border">
							{result.query}
						</div>

						{result.error ? (
							<div className="bg-red-50 border border-red-200 rounded p-3">
								<p className="text-sm text-red-700 font-medium mb-1">Query Error:</p>
								<p className="text-sm text-red-600 font-mono whitespace-pre-wrap">
									{result.error}
								</p>
							</div>
						) : result.results.length > 0 ? (
							<div className="overflow-auto max-h-96 border rounded bg-background">
								<Table>
									<TableHeader className="sticky top-0 bg-background z-10">
										<TableRow>
											{Object.keys(result.results[0]).map((column) => (
												<TableHead key={column} className="font-semibold">
													{column}
												</TableHead>
											))}
										</TableRow>
									</TableHeader>
									<TableBody>
										{result.results.map((row, rowIndex) => (
											<TableRow key={rowIndex} className="hover:bg-muted/50">
												{Object.values(row).map((value, cellIndex) => (
													<TableCell key={cellIndex} className="font-mono text-sm">
														{value === null ? (
															<span className="text-muted-foreground italic">
																NULL
															</span>
														) : (
															String(value)
														)}
													</TableCell>
												))}
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						) : (
							<div className="text-center py-4 text-muted-foreground text-sm">
								Query executed successfully with no results
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

const QueryResults: React.FC<QueryResultsProps> = ({
	queryHistory = [],
	isLoading = false,
	currentQuery,
}) => {
	const reversedHistory = [...queryHistory].reverse();
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const previousHistoryLength = useRef(queryHistory.length);

	// Auto-scroll to top when a new query result is added
	useEffect(() => {
		if (queryHistory.length > previousHistoryLength.current) {
			// New query was added, scroll to top with smooth animation
			if (scrollContainerRef.current) {
				scrollContainerRef.current.scrollTo({
					top: 0,
					behavior: 'smooth'
				});
			}
		}
		previousHistoryLength.current = queryHistory.length;
	}, [queryHistory.length]);

	return (
		<Card className="h-full flex flex-col">
			<CardHeader className="pb-4">
				<div className="flex items-center justify-between">
					<CardTitle className="text-lg">Query Results History</CardTitle>
					<div className="flex items-center gap-2">
						{isLoading && (
							<Badge variant="secondary" className="bg-blue-100 text-blue-800">
								<Clock className="w-4 h-4 mr-1 animate-spin" />
								Executing...
							</Badge>
						)}
						{queryHistory.length > 0 && (
							<Badge variant="outline">
								{queryHistory.length} {queryHistory.length === 1 ? 'query' : 'queries'}
							</Badge>
						)}
					</div>
				</div>
			</CardHeader>
			<CardContent className="flex-1 p-0 overflow-hidden">
				{isLoading && currentQuery ? (
					<div className="p-4 border-b bg-blue-50/50">
						<div className="flex items-center gap-3">
							<Clock className="w-5 h-5 text-blue-500 animate-spin" />
							<div className="flex-1">
								<p className="text-sm font-medium text-blue-700">Executing query...</p>
								<p className="text-xs text-blue-600 font-mono mt-1">
									{currentQuery.replace(/\s+/g, " ").trim().substring(0, 100)}
									{currentQuery.length > 100 && "..."}
								</p>
							</div>
						</div>
					</div>
				) : null}

				{queryHistory.length > 0 ? (
					<div ref={scrollContainerRef} className="h-full overflow-auto p-4">
						{reversedHistory.map((result, index) => (
							<QueryResultItem
								key={result.id}
								result={result}
								index={queryHistory.length - index - 1}
								isLatest={index === 0 && !isLoading}
							/>
						))}
					</div>
				) : (
					<div className="flex items-center justify-center h-full">
						<div className="text-center">
							<div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
								<Database className="w-6 h-6 text-muted-foreground" />
							</div>
							<p className="text-muted-foreground text-sm">
								Run a query to see results here
							</p>
							<p className="text-muted-foreground text-xs mt-1">
								All query results will be saved in this feed
							</p>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
};

export default QueryResults;