import type React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ParsedTask } from "../lib/taskParser";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface TaskDescriptionProps {
	task: ParsedTask;
}

const TaskDescription: React.FC<TaskDescriptionProps> = ({ task }) => {
	const { title, difficulty } = task.metadata;
	// Process the content to handle tables in code blocks
	const processedDescription = task.content.replace(
		/```\n((?:[^\n]*\|[^\n]*\n)+)```/g,
		(match, tableContent) => {
			// Check if it looks like a markdown table
			if (tableContent.includes("|") && tableContent.includes("---")) {
				return tableContent.trim();
			}
			return match;
		},
	);
	const description = processedDescription;
	const expectedOutput = undefined; // Can be extracted from content if needed
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
		<Card className="h-full flex flex-col overflow-hidden">
			<CardHeader className="pb-4 flex-shrink-0">
				<div className="flex items-start justify-between gap-4">
					<CardTitle className="text-lg leading-tight">{title}</CardTitle>
					<Badge className={getDifficultyColor(difficulty)}>{difficulty}</Badge>
				</div>
			</CardHeader>
			<CardContent className="flex-1 overflow-auto pb-6">
				<div className="text-sm leading-relaxed text-muted-foreground">
					<ReactMarkdown
						remarkPlugins={[remarkGfm]}
						components={{
							h1: ({ children }) => (
								<h1 className="text-lg font-semibold mb-2">{children}</h1>
							),
							h2: ({ children }) => (
								<h2 className="text-base font-semibold mb-2">{children}</h2>
							),
							h3: ({ children }) => (
								<h3 className="text-sm font-semibold mb-2">{children}</h3>
							),
							p: ({ children }) => <p className="mb-2">{children}</p>,
							ul: ({ children }) => (
								<ul className="list-disc list-inside mb-2 space-y-1">
									{children}
								</ul>
							),
							ol: ({ children }) => (
								<ol className="list-decimal list-inside mb-2 space-y-1">
									{children}
								</ol>
							),
							li: ({ children }) => <li className="ml-2">{children}</li>,
							code: ({ children, ...props }) => {
								const inline = !("className" in props);
								return inline ? (
									<code className="bg-muted px-1.5 py-0.5 rounded font-mono text-xs">
										{children}
									</code>
								) : (
									<pre className="bg-muted p-3 rounded text-xs overflow-x-auto font-mono mb-2">
										<code>{children}</code>
									</pre>
								);
							},
							pre: ({ children }) => <>{children}</>,
							strong: ({ children }) => (
								<strong className="font-semibold">{children}</strong>
							),
							em: ({ children }) => <em className="italic">{children}</em>,
							table: ({ children }) => (
								<div className="overflow-x-auto mb-4">
									<table className="min-w-full border-collapse">
										{children}
									</table>
								</div>
							),
							thead: ({ children }) => (
								<thead className="bg-muted/50 border-b">{children}</thead>
							),
							tbody: ({ children }) => <tbody>{children}</tbody>,
							tr: ({ children }) => (
								<tr className="border-b border-muted">{children}</tr>
							),
							th: ({ children }) => (
								<th className="px-3 py-2 text-left font-medium text-xs">
									{children}
								</th>
							),
							td: ({ children }) => (
								<td className="px-3 py-2 text-xs">{children}</td>
							),
						}}
					>
						{description}
					</ReactMarkdown>
				</div>

				{expectedOutput && (
					<div>
						<h4 className="font-medium mb-2 text-sm">Expected Output</h4>
						<pre className="bg-muted p-3 rounded text-xs overflow-x-auto font-mono">
							{expectedOutput}
						</pre>
					</div>
				)}
			</CardContent>
		</Card>
	);
};

export default TaskDescription;
