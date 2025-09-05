import { Clock, Play, Users } from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface CodeEditorProps {
	initialQuery?: string;
	onQueryChange?: (query: string) => void;
	onRunQuery?: (query: string) => void;
	isLoading?: boolean;
	collaborators?: { name: string; color: string }[];
}

const CodeEditor: React.FC<CodeEditorProps> = ({
	initialQuery = "",
	onQueryChange,
	onRunQuery,
	isLoading = false,
	collaborators = [],
}) => {
	const [query, setQuery] = useState(initialQuery);
	const [lastRun, setLastRun] = useState<Date | null>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const handleQueryChange = (value: string) => {
		setQuery(value);
		onQueryChange?.(value);
	};

	const handleRunQuery = () => {
		setLastRun(new Date());
		onRunQuery?.(query);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Tab") {
			e.preventDefault();
			const textarea = e.currentTarget;
			const start = textarea.selectionStart;
			const end = textarea.selectionEnd;

			const newValue = `${query.substring(0, start)}  ${query.substring(end)}`;
			setQuery(newValue);
			onQueryChange?.(newValue);

			setTimeout(() => {
				textarea.selectionStart = textarea.selectionEnd = start + 2;
			}, 0);
		} else if (e.ctrlKey && e.key === "Enter") {
			e.preventDefault();
			handleRunQuery();
		}
	};

	const formatTime = (date: Date) => {
		return date.toLocaleTimeString("en-US", {
			hour12: false,
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
		});
	};

	// SQL keywords for basic syntax highlighting
	const sqlKeywords = [
		"SELECT",
		"FROM",
		"WHERE",
		"JOIN",
		"INNER",
		"LEFT",
		"RIGHT",
		"OUTER",
		"ON",
		"GROUP",
		"BY",
		"ORDER",
		"HAVING",
		"DISTINCT",
		"AS",
		"AND",
		"OR",
		"NOT",
		"IN",
		"LIKE",
		"BETWEEN",
		"IS",
		"NULL",
		"COUNT",
		"SUM",
		"AVG",
		"MAX",
		"MIN",
		"INSERT",
		"UPDATE",
		"DELETE",
		"CREATE",
		"ALTER",
		"DROP",
		"TABLE",
		"INDEX",
	];

	const renderSyntaxHighlighting = () => {
		if (!query) return "";

		let highlighted = query;

		// Highlight SQL keywords
		sqlKeywords.forEach((keyword) => {
			const regex = new RegExp(`\\b${keyword}\\b`, "gi");
			highlighted = highlighted.replace(
				regex,
				`<span class="sql-keyword">${keyword.toUpperCase()}</span>`,
			);
		});

		// Highlight strings
		highlighted = highlighted.replace(
			/'([^']*)'/g,
			"<span class=\"sql-string\">'$1'</span>",
		);
		highlighted = highlighted.replace(
			/"([^"]*)"/g,
			'<span class="sql-string">"$1"</span>',
		);

		// Highlight numbers
		highlighted = highlighted.replace(
			/\b\d+\.?\d*\b/g,
			'<span class="sql-number">$&</span>',
		);

		// Highlight comments
		highlighted = highlighted.replace(
			/--.*$/gm,
			'<span class="sql-comment">$&</span>',
		);

		return highlighted;
	};

	return (
		<Card className="h-full flex flex-col">
			<CardHeader className="pb-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<CardTitle className="text-lg">SQL Query Editor</CardTitle>
						{collaborators.length > 0 && (
							<div className="flex items-center gap-2">
								<Users className="w-4 h-4 text-muted-foreground" />
								<div className="flex gap-1">
									{collaborators.map((collaborator, index) => (
										<Badge
											key={index}
											variant="secondary"
											className="text-xs px-2 py-1"
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
						)}
					</div>
					<div className="flex items-center gap-2">
						{lastRun && (
							<div className="flex items-center gap-1 text-sm text-muted-foreground">
								<Clock className="w-3 h-3" />
								{formatTime(lastRun)}
							</div>
						)}
						<Button
							onClick={handleRunQuery}
							disabled={isLoading || !query.trim()}
							className="gap-2"
							size="sm"
						>
							<Play className="w-4 h-4" />
							{isLoading ? "Running..." : "Run"}
						</Button>
					</div>
				</div>
			</CardHeader>
			<CardContent className="flex-1 flex flex-col p-0">
				<div className="flex-1 relative">
					<style jsx>{`
            .sql-keyword { color: #0066cc; font-weight: 600; }
            .sql-string { color: #009900; }
            .sql-number { color: #cc6600; }
            .sql-comment { color: #999999; font-style: italic; }
          `}</style>

					{/* Syntax highlighting background */}
					<div
						className="absolute inset-4 pointer-events-none font-mono text-sm whitespace-pre-wrap overflow-hidden text-transparent leading-6"
						dangerouslySetInnerHTML={{ __html: renderSyntaxHighlighting() }}
					/>

					{/* Actual textarea */}
					<textarea
						ref={textareaRef}
						value={query}
						onChange={(e) => handleQueryChange(e.target.value)}
						onKeyDown={handleKeyDown}
						placeholder="-- Enter your SQL query here
-- Press Ctrl+Enter to run
-- Press Tab to indent

SELECT * FROM customers;"
						className="absolute inset-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)] bg-transparent border-none outline-none resize-none font-mono text-sm text-foreground leading-6"
						style={{
							fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
							caretColor: "currentColor",
						}}
					/>
				</div>
				<div className="px-4 pb-4 pt-2 text-xs text-muted-foreground border-t border-border">
					Press{" "}
					<kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">
						Ctrl+Enter
					</kbd>{" "}
					to run query •{" "}
					<kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Tab</kbd> to
					indent
				</div>
			</CardContent>
		</Card>
	);
};

export default CodeEditor;
