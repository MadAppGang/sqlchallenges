import type React from "react";
import { Badge } from "./ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "./ui/table";

interface TableSchema {
	tableName: string;
	columns: {
		name: string;
		type: string;
		description?: string;
	}[];
	sampleData: Record<string, string | number | null>[];
}

interface ChallengeData {
	id: number;
	title: string;
	difficulty: "Easy" | "Medium" | "Hard";
	description: string;
	tables: TableSchema[];
	expectedOutput?: string;
}

interface ChallengeDisplayProps {
	challenge: ChallengeData;
}

const ChallengeDisplay: React.FC<ChallengeDisplayProps> = ({ challenge }) => {
	const getDifficultyColor = (difficulty: string) => {
		switch (difficulty) {
			case "Easy":
				return "bg-green-100 text-green-800";
			case "Medium":
				return "bg-yellow-100 text-yellow-800";
			case "Hard":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	return (
		<div className="space-y-6">
			{/* Challenge Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="mb-2">{challenge.title}</h1>
					<Badge className={getDifficultyColor(challenge.difficulty)}>
						{challenge.difficulty}
					</Badge>
				</div>
			</div>

			{/* Challenge Description */}
			<Card>
				<CardHeader>
					<CardTitle>Problem Description</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="whitespace-pre-line">{challenge.description}</p>
				</CardContent>
			</Card>

			{/* Database Schema */}
			<Card>
				<CardHeader>
					<CardTitle>Database Schema</CardTitle>
					<CardDescription>
						Tables and sample data available for this challenge
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					{challenge.tables.map((table, index) => (
						<div key={index}>
							<h3 className="mb-3">{table.tableName}</h3>

							{/* Schema */}
							<div className="mb-4">
								<h4 className="mb-2">Schema:</h4>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Column</TableHead>
											<TableHead>Type</TableHead>
											<TableHead>Description</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{table.columns.map((column, colIndex) => (
											<TableRow key={colIndex}>
												<TableCell className="font-mono">
													{column.name}
												</TableCell>
												<TableCell className="font-mono text-muted-foreground">
													{column.type}
												</TableCell>
												<TableCell>{column.description || "-"}</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>

							{/* Sample Data */}
							<div>
								<h4 className="mb-2">Sample Data:</h4>
								<Table>
									<TableHeader>
										<TableRow>
											{table.columns.map((column, colIndex) => (
												<TableHead key={colIndex}>{column.name}</TableHead>
											))}
										</TableRow>
									</TableHeader>
									<TableBody>
										{table.sampleData.slice(0, 5).map((row, rowIndex) => (
											<TableRow key={rowIndex}>
												{table.columns.map((column, colIndex) => (
													<TableCell key={colIndex} className="font-mono">
														{row[column.name]}
													</TableCell>
												))}
											</TableRow>
										))}
									</TableBody>
								</Table>
								{table.sampleData.length > 5 && (
									<p className="text-sm text-muted-foreground mt-2">
										... and {table.sampleData.length - 5} more rows
									</p>
								)}
							</div>
						</div>
					))}
				</CardContent>
			</Card>

			{/* Expected Output (if provided) */}
			{challenge.expectedOutput && (
				<Card>
					<CardHeader>
						<CardTitle>Expected Output</CardTitle>
					</CardHeader>
					<CardContent>
						<pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
							{challenge.expectedOutput}
						</pre>
					</CardContent>
				</Card>
			)}
		</div>
	);
};

export default ChallengeDisplay;
