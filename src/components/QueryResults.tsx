import { AlertCircle, CheckCircle, Clock } from "lucide-react";
import type React from "react";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "./ui/table";

interface QueryResultsProps {
	results?: Record<string, string | number | null>[];
	isLoading?: boolean;
	error?: string;
	executionTime?: number;
}

const QueryResults: React.FC<QueryResultsProps> = ({
	results = [],
	isLoading = false,
	error,
	executionTime,
}) => {
	const getStatusIcon = () => {
		if (isLoading)
			return <Clock className="w-4 h-4 text-blue-500 animate-spin" />;
		if (error) return <AlertCircle className="w-4 h-4 text-red-500" />;
		if (results.length > 0)
			return <CheckCircle className="w-4 h-4 text-green-500" />;
		return null;
	};

	const getStatusText = () => {
		if (isLoading) return "Executing query...";
		if (error) return "Query failed";
		if (results.length > 0)
			return `${results.length} row${results.length !== 1 ? "s" : ""} returned`;
		return "No results";
	};

	const getStatusColor = () => {
		if (isLoading) return "bg-blue-100 text-blue-800";
		if (error) return "bg-red-100 text-red-800";
		if (results.length > 0) return "bg-green-100 text-green-800";
		return "bg-gray-100 text-gray-800";
	};

	return (
		<Card className="h-full flex flex-col">
			<CardHeader className="pb-4">
				<div className="flex items-center justify-between">
					<CardTitle className="text-lg">Query Results</CardTitle>
					<div className="flex items-center gap-2">
						{executionTime && !isLoading && (
							<span className="text-xs text-muted-foreground">
								{executionTime}ms
							</span>
						)}
						<Badge variant="secondary" className={getStatusColor()}>
							<div className="flex items-center gap-1">
								{getStatusIcon()}
								{getStatusText()}
							</div>
						</Badge>
					</div>
				</div>
			</CardHeader>
			<CardContent className="flex-1 p-0">
				{isLoading ? (
					<div className="flex items-center justify-center h-full">
						<div className="flex flex-col items-center gap-3">
							<Clock className="w-8 h-8 text-blue-500 animate-spin" />
							<p className="text-sm text-muted-foreground">
								Executing query...
							</p>
						</div>
					</div>
				) : error ? (
					<div className="flex items-center justify-center h-full p-4">
						<div className="flex flex-col items-center gap-3 text-center max-w-md">
							<AlertCircle className="w-8 h-8 text-red-500" />
							<div>
								<p className="font-medium text-red-700 mb-1">Query Error</p>
								<p className="text-sm text-red-600 whitespace-pre-wrap">
									{error}
								</p>
							</div>
						</div>
					</div>
				) : results.length > 0 ? (
					<div className="h-full overflow-auto">
						<Table>
							<TableHeader className="sticky top-0 bg-background z-10">
								<TableRow>
									{Object.keys(results[0]).map((column) => (
										<TableHead key={column} className="font-semibold">
											{column}
										</TableHead>
									))}
								</TableRow>
							</TableHeader>
							<TableBody>
								{results.map((row, index) => (
									<TableRow key={index} className="hover:bg-muted/50">
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
					<div className="flex items-center justify-center h-full">
						<div className="text-center">
							<div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
								<Table className="w-6 h-6 text-muted-foreground" />
							</div>
							<p className="text-muted-foreground text-sm">
								Run a query to see results here
							</p>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
};

export default QueryResults;
