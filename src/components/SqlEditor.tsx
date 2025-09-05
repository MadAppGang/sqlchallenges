import { Clock, Play, Users } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "./ui/table";
import { Textarea } from "./ui/textarea";

interface SqlEditorProps {
	initialQuery?: string;
	onQueryChange?: (query: string) => void;
	onRunQuery?: (query: string) => void;
	results?: Record<string, string | number | null>[];
	isLoading?: boolean;
	collaborators?: { name: string; color: string }[];
}

const SqlEditor: React.FC<SqlEditorProps> = ({
	initialQuery = "",
	onQueryChange,
	onRunQuery,
	results = [],
	isLoading = false,
	collaborators = [],
}) => {
	const [query, setQuery] = useState(initialQuery);
	const [lastRun, setLastRun] = useState<Date | null>(null);

	const handleQueryChange = (value: string) => {
		setQuery(value);
		onQueryChange?.(value);
	};

	const handleRunQuery = () => {
		setLastRun(new Date());
		onRunQuery?.(query);
	};

	const formatTime = (date: Date) => {
		return date.toLocaleTimeString("en-US", {
			hour12: false,
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
		});
	};

	return (
		<div className="space-y-4">
			{/* Collaboration Status */}
			{collaborators.length > 0 && (
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center gap-4">
							<div className="flex items-center gap-2">
								<Users className="w-4 h-4 text-muted-foreground" />
								<span className="text-sm">Active collaborators:</span>
							</div>
							<div className="flex gap-2">
								{collaborators.map((collaborator, index) => (
									<Badge
										key={index}
										variant="secondary"
										className="text-xs"
										style={{
											backgroundColor: `${collaborator.color}20`,
											color: collaborator.color,
										}}
									>
										{collaborator.name}
									</Badge>
								))}
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			{/* SQL Editor */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle>SQL Query</CardTitle>
						<div className="flex items-center gap-2">
							{lastRun && (
								<div className="flex items-center gap-1 text-sm text-muted-foreground">
									<Clock className="w-3 h-3" />
									Last run: {formatTime(lastRun)}
								</div>
							)}
							<Button
								onClick={handleRunQuery}
								disabled={isLoading || !query.trim()}
								className="gap-2"
							>
								<Play className="w-4 h-4" />
								{isLoading ? "Running..." : "Run Query"}
							</Button>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<Textarea
						value={query}
						onChange={(e) => handleQueryChange(e.target.value)}
						placeholder="Enter your SQL query here..."
						className="min-h-32 font-mono text-sm"
						style={{ fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace' }}
					/>
				</CardContent>
			</Card>

			{/* Results */}
			<Card>
				<CardHeader>
					<CardTitle>Query Results</CardTitle>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<div className="flex items-center justify-center py-8">
							<div className="text-muted-foreground">Running query...</div>
						</div>
					) : results.length > 0 ? (
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										{Object.keys(results[0]).map((column) => (
											<TableHead key={column}>{column}</TableHead>
										))}
									</TableRow>
								</TableHeader>
								<TableBody>
									{results.map((row, index) => (
										<TableRow key={index}>
											{Object.values(row).map((value, cellIndex) => (
												<TableCell
													key={cellIndex}
													className="font-mono text-sm"
												>
													{String(value)}
												</TableCell>
											))}
										</TableRow>
									))}
								</TableBody>
							</Table>
							<div className="mt-2 text-sm text-muted-foreground">
								{results.length} row{results.length !== 1 ? "s" : ""} returned
							</div>
						</div>
					) : (
						<div className="text-center py-8 text-muted-foreground">
							No results yet. Run a query to see results here.
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
};

export default SqlEditor;
