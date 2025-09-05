import Editor, { type Monaco } from "@monaco-editor/react";
import { Clock, Play, Users } from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import type { editor } from "monaco-editor";
import { databaseSchema } from "../lib/databaseSchema";

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
	const [theme, setTheme] = useState<"vs-dark" | "light">("vs-dark");
	const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
	const monacoRef = useRef<Monaco | null>(null);

	// Detect system theme
	useEffect(() => {
		const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
		setTheme(isDark ? "vs-dark" : "light");

		const handleThemeChange = (e: MediaQueryListEvent) => {
			setTheme(e.matches ? "vs-dark" : "light");
		};

		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		mediaQuery.addEventListener("change", handleThemeChange);

		return () => {
			mediaQuery.removeEventListener("change", handleThemeChange);
		};
	}, []);

	const handleQueryChange = (value: string | undefined) => {
		const newValue = value || "";
		setQuery(newValue);
		onQueryChange?.(newValue);
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

	const handleEditorDidMount = (
		editor: editor.IStandaloneCodeEditor,
		monaco: Monaco,
	) => {
		editorRef.current = editor;
		monacoRef.current = monaco;

		// Register SQL keywords and functions for autocomplete
		monaco.languages.registerCompletionItemProvider("sql", {
			provideCompletionItems: (model, position) => {
				const suggestions = [];

				// SQL Keywords
				const keywords = [
					"SELECT",
					"FROM",
					"WHERE",
					"JOIN",
					"INNER JOIN",
					"LEFT JOIN",
					"RIGHT JOIN",
					"FULL OUTER JOIN",
					"ON",
					"GROUP BY",
					"ORDER BY",
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
					"INSERT INTO",
					"VALUES",
					"UPDATE",
					"SET",
					"DELETE FROM",
					"CREATE TABLE",
					"ALTER TABLE",
					"DROP TABLE",
					"CREATE INDEX",
					"DROP INDEX",
					"UNION",
					"UNION ALL",
					"CASE",
					"WHEN",
					"THEN",
					"ELSE",
					"END",
					"EXISTS",
					"LIMIT",
					"OFFSET",
				];

				keywords.forEach((keyword) => {
					suggestions.push({
						label: keyword,
						kind: monaco.languages.CompletionItemKind.Keyword,
						insertText: keyword,
						documentation: `SQL keyword: ${keyword}`,
					});
				});

				// SQL Functions
				const functions = [
					{ name: "COUNT", signature: "COUNT(column)" },
					{ name: "SUM", signature: "SUM(column)" },
					{ name: "AVG", signature: "AVG(column)" },
					{ name: "MAX", signature: "MAX(column)" },
					{ name: "MIN", signature: "MIN(column)" },
					{ name: "ROUND", signature: "ROUND(number, decimals)" },
					{ name: "CONCAT", signature: "CONCAT(string1, string2, ...)" },
					{ name: "LENGTH", signature: "LENGTH(string)" },
					{ name: "UPPER", signature: "UPPER(string)" },
					{ name: "LOWER", signature: "LOWER(string)" },
					{ name: "SUBSTRING", signature: "SUBSTRING(string, start, length)" },
					{ name: "REPLACE", signature: "REPLACE(string, old, new)" },
					{ name: "TRIM", signature: "TRIM(string)" },
					{ name: "NOW", signature: "NOW()" },
					{ name: "DATE", signature: "DATE(expression)" },
					{ name: "YEAR", signature: "YEAR(date)" },
					{ name: "MONTH", signature: "MONTH(date)" },
					{ name: "DAY", signature: "DAY(date)" },
					{ name: "COALESCE", signature: "COALESCE(value1, value2, ...)" },
					{ name: "CAST", signature: "CAST(expression AS datatype)" },
					{ name: "ROW_NUMBER", signature: "ROW_NUMBER() OVER (ORDER BY column)" },
					{ name: "RANK", signature: "RANK() OVER (ORDER BY column)" },
					{ name: "DENSE_RANK", signature: "DENSE_RANK() OVER (ORDER BY column)" },
				];

				functions.forEach((func) => {
					suggestions.push({
						label: func.name,
						kind: monaco.languages.CompletionItemKind.Function,
						insertText: func.signature,
						insertTextRules:
							monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
						documentation: `SQL function: ${func.signature}`,
					});
				});

				// Add tables and columns from database schema
				databaseSchema.forEach((table) => {
					// Add table name
					suggestions.push({
						label: table.tableName,
						kind: monaco.languages.CompletionItemKind.Class,
						insertText: table.tableName,
						documentation: `Table: ${table.tableName}`,
						detail: `Table with ${table.columns.length} columns`,
					});

					// Add columns for this table
					table.columns.forEach((column) => {
						suggestions.push({
							label: column.name,
							kind: monaco.languages.CompletionItemKind.Field,
							insertText: column.name,
							documentation: column.description || `Column: ${column.name}`,
							detail: `${table.tableName}.${column.name} (${column.type})`,
						});

						// Also add table.column notation
						suggestions.push({
							label: `${table.tableName}.${column.name}`,
							kind: monaco.languages.CompletionItemKind.Field,
							insertText: `${table.tableName}.${column.name}`,
							documentation: column.description || `Column: ${column.name}`,
							detail: `Type: ${column.type}`,
						});
					});
				});

				return { suggestions };
			},
		});

		// Add keyboard shortcut for running query
		editor.addCommand(
			monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
			() => {
				handleRunQuery();
			},
		);

		// Focus the editor
		editor.focus();
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
				<div className="flex-1 min-h-0">
					<Editor
						height="100%"
						defaultLanguage="sql"
						language="sql"
						value={query}
						onChange={handleQueryChange}
						onMount={handleEditorDidMount}
						theme={theme}
						options={{
							minimap: { enabled: false },
							fontSize: 14,
							lineNumbers: "on",
							roundedSelection: false,
							scrollBeyondLastLine: false,
							readOnly: false,
							automaticLayout: true,
							wordWrap: "on",
							suggestOnTriggerCharacters: true,
							quickSuggestions: {
								other: true,
								comments: false,
								strings: false,
							},
							autoClosingBrackets: "always",
							autoClosingQuotes: "always",
							formatOnType: true,
							formatOnPaste: true,
							trimAutoWhitespace: true,
							padding: { top: 16, bottom: 16 },
							fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
							placeholder: `-- Enter your SQL query here
-- Press Ctrl+Enter to run
-- Start typing for autocomplete suggestions

SELECT * FROM customers;`,
						}}
					/>
				</div>
				<div className="px-4 pb-4 pt-2 text-xs text-muted-foreground border-t border-border">
					Press{" "}
					<kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">
						Ctrl+Enter
					</kbd>{" "}
					to run query • Start typing for autocomplete suggestions
				</div>
			</CardContent>
		</Card>
	);
};

export default CodeEditor;