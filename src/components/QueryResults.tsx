import type React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";

interface QueryResultsProps {
	result: Record<string, unknown>[] | null;
	error: string | null;
	executionTime: number;
}

export const QueryResults: React.FC<QueryResultsProps> = ({
	result,
	error,
	executionTime,
}) => {
	if (error) {
		return (
			<Card className="h-full flex flex-col">
				<CardHeader className="pb-3 flex-shrink-0">
					<CardTitle className="text-base">Query Results</CardTitle>
				</CardHeader>
				<CardContent className="flex-1 overflow-auto">
					<Alert variant="destructive">
						<AlertCircle className="h-4 w-4" />
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				</CardContent>
			</Card>
		);
	}

	if (!result) {
		return (
			<Card className="h-full flex flex-col">
				<CardHeader className="pb-3 flex-shrink-0">
					<CardTitle className="text-base">Query Results</CardTitle>
				</CardHeader>
				<CardContent className="flex-1 overflow-auto">
					<div className="text-sm text-muted-foreground">
						Run a query to see results here
					</div>
				</CardContent>
			</Card>
		);
	}

	const columns = result.length > 0 ? Object.keys(result[0]) : [];

	return (
		<Card className="h-full flex flex-col">
			<CardHeader className="pb-3 flex-shrink-0">
				<div className="flex items-center justify-between">
					<CardTitle className="text-base">Query Results</CardTitle>
					<div className="flex items-center gap-4 text-sm text-muted-foreground">
						<div className="flex items-center gap-1">
							<CheckCircle className="w-3 h-3 text-green-600" />
							<span>{result.length} rows</span>
						</div>
						<div className="flex items-center gap-1">
							<Clock className="w-3 h-3" />
							<span>{executionTime.toFixed(2)}ms</span>
						</div>
					</div>
				</div>
			</CardHeader>
			<CardContent className="flex-1 overflow-auto p-0">
				{result.length > 0 ? (
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-muted/50 sticky top-0">
								<tr>
									{columns.map((col) => (
										<th
											key={col}
											className="px-3 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider border-b"
										>
											{col}
										</th>
									))}
								</tr>
							</thead>
							<tbody className="divide-y divide-border">
								{result.map((row, idx) => (
									<tr key={idx} className="hover:bg-muted/30">
										{columns.map((col) => (
											<td key={col} className="px-3 py-2 text-sm">
												{row[col] !== null ? String(row[col]) : "NULL"}
											</td>
										))}
									</tr>
								))}
							</tbody>
						</table>
					</div>
				) : (
					<div className="p-4 text-sm text-muted-foreground">
						Query executed successfully but returned no rows
					</div>
				)}
			</CardContent>
		</Card>
	);
};