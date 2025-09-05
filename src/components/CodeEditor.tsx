import Editor, { type Monaco } from "@monaco-editor/react";
import { Play, Users } from "lucide-react";
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
		onRunQuery?.(query);
	};


	// Force editor to resize when container changes
	useEffect(() => {
		const handleResize = () => {
			if (editorRef.current) {
				// Force Monaco Editor to recalculate its layout
				setTimeout(() => {
					editorRef.current?.layout();
				}, 0);
			}
		};

		// Listen for window resize
		window.addEventListener('resize', handleResize);
		
		// Use ResizeObserver to detect container size changes
		let resizeObserver: ResizeObserver | null = null;
		
		// Set up observer after a short delay to ensure DOM is ready
		const timeoutId = setTimeout(() => {
			const editorContainer = document.querySelector('.monaco-editor-container');
			if (editorContainer) {
				resizeObserver = new ResizeObserver(() => {
					handleResize();
				});
				resizeObserver.observe(editorContainer);
			}
		}, 100);

		return () => {
			window.removeEventListener('resize', handleResize);
			clearTimeout(timeoutId);
			resizeObserver?.disconnect();
		};
	}, []);

	const handleEditorDidMount = (
		editor: editor.IStandaloneCodeEditor,
		monaco: Monaco,
	) => {
		editorRef.current = editor;
		monacoRef.current = monaco;

		// Force initial layout
		editor.layout();

		// Register SQL keywords and functions for autocomplete
		monaco.languages.registerCompletionItemProvider("sql", {
			provideCompletionItems: (model, position) => {
				const suggestions = [];
				const uniqueSuggestions = new Map();

				// Get the current word being typed
				const word = model.getWordUntilPosition(position);
				const range = {
					startLineNumber: position.lineNumber,
					endLineNumber: position.lineNumber,
					startColumn: word.startColumn,
					endColumn: word.endColumn,
				};

				// SQL Keywords - avoiding duplicates
				const keywords = [
					"SELECT",
					"FROM",
					"WHERE",
					"JOIN",
					"INNER",
					"LEFT", 
					"RIGHT",
					"FULL",
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
					"INSERT",
					"INTO",
					"VALUES",
					"UPDATE",
					"SET",
					"DELETE",
					"CREATE",
					"TABLE",
					"ALTER",
					"DROP",
					"INDEX",
					"UNION",
					"ALL",
					"CASE",
					"WHEN",
					"THEN",
					"ELSE",
					"END",
					"EXISTS",
					"LIMIT",
					"OFFSET",
					"ASC",
					"DESC",
					"WITH",
				];

				keywords.forEach((keyword) => {
					if (!uniqueSuggestions.has(keyword)) {
						uniqueSuggestions.set(keyword, {
							label: keyword,
							kind: monaco.languages.CompletionItemKind.Keyword,
							insertText: keyword,
							documentation: `SQL keyword: ${keyword}`,
							range: range,
							sortText: "1" + keyword,
						});
					}
				});

				// SQL Functions
				const functions = [
					{ name: "COUNT", signature: "COUNT(${1:column})" },
					{ name: "SUM", signature: "SUM(${1:column})" },
					{ name: "AVG", signature: "AVG(${1:column})" },
					{ name: "MAX", signature: "MAX(${1:column})" },
					{ name: "MIN", signature: "MIN(${1:column})" },
					{ name: "ROUND", signature: "ROUND(${1:number}, ${2:decimals})" },
					{ name: "CONCAT", signature: "CONCAT(${1:string1}, ${2:string2})" },
					{ name: "LENGTH", signature: "LENGTH(${1:string})" },
					{ name: "UPPER", signature: "UPPER(${1:string})" },
					{ name: "LOWER", signature: "LOWER(${1:string})" },
					{ name: "SUBSTRING", signature: "SUBSTRING(${1:string}, ${2:start}, ${3:length})" },
					{ name: "REPLACE", signature: "REPLACE(${1:string}, ${2:old}, ${3:new})" },
					{ name: "TRIM", signature: "TRIM(${1:string})" },
					{ name: "NOW", signature: "NOW()" },
					{ name: "DATE", signature: "DATE(${1:expression})" },
					{ name: "YEAR", signature: "YEAR(${1:date})" },
					{ name: "MONTH", signature: "MONTH(${1:date})" },
					{ name: "DAY", signature: "DAY(${1:date})" },
					{ name: "COALESCE", signature: "COALESCE(${1:value1}, ${2:value2})" },
					{ name: "CAST", signature: "CAST(${1:expression} AS ${2:datatype})" },
					{ name: "ROW_NUMBER", signature: "ROW_NUMBER() OVER (ORDER BY ${1:column})" },
					{ name: "RANK", signature: "RANK() OVER (ORDER BY ${1:column})" },
					{ name: "DENSE_RANK", signature: "DENSE_RANK() OVER (ORDER BY ${1:column})" },
				];

				functions.forEach((func) => {
					if (!uniqueSuggestions.has(func.name)) {
						uniqueSuggestions.set(func.name, {
							label: func.name,
							kind: monaco.languages.CompletionItemKind.Function,
							insertText: func.signature,
							insertTextRules:
								monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
							documentation: `SQL function: ${func.name}`,
							detail: func.signature.replace(/\$\{\d+:([^}]+)\}/g, '$1'),
							range: range,
							sortText: "2" + func.name,
						});
					}
				});

				// Add tables from database schema
				databaseSchema.forEach((table) => {
					if (!uniqueSuggestions.has(table.tableName)) {
						uniqueSuggestions.set(table.tableName, {
							label: table.tableName,
							kind: monaco.languages.CompletionItemKind.Class,
							insertText: table.tableName,
							documentation: `Table with ${table.columns.length} columns`,
							detail: `Table: ${table.tableName}`,
							range: range,
							sortText: "3" + table.tableName,
						});
					}
				});

				// Add unique column names (without duplicates)
				const uniqueColumns = new Set();
				databaseSchema.forEach((table) => {
					table.columns.forEach((column) => {
						// Add simple column name only once
						if (!uniqueColumns.has(column.name) && !uniqueSuggestions.has(column.name)) {
							uniqueColumns.add(column.name);
							uniqueSuggestions.set(column.name, {
								label: column.name,
								kind: monaco.languages.CompletionItemKind.Field,
								insertText: column.name,
								documentation: column.description || `Column name`,
								detail: `Column found in: ${databaseSchema
									.filter(t => t.columns.some(c => c.name === column.name))
									.map(t => t.tableName)
									.join(', ')}`,
								range: range,
								sortText: "4" + column.name,
							});
						}

						// Add fully qualified table.column notation
						const qualifiedName = `${table.tableName}.${column.name}`;
						if (!uniqueSuggestions.has(qualifiedName)) {
							uniqueSuggestions.set(qualifiedName, {
								label: qualifiedName,
								kind: monaco.languages.CompletionItemKind.Field,
								insertText: qualifiedName,
								documentation: column.description || `Column: ${column.name}`,
								detail: `Type: ${column.type}`,
								range: range,
								sortText: "5" + qualifiedName,
							});
						}
					});
				});

				// Common SQL snippets
				const snippets = [
					{
						label: "SELECT * FROM",
						insertText: "SELECT * FROM ${1:table}",
						detail: "Select all columns from a table",
					},
					{
						label: "SELECT columns FROM",
						insertText: "SELECT ${1:columns} FROM ${2:table}",
						detail: "Select specific columns from a table",
					},
					{
						label: "WHERE condition",
						insertText: "WHERE ${1:column} = ${2:value}",
						detail: "Add WHERE clause",
					},
					{
						label: "JOIN tables",
						insertText: "JOIN ${1:table2} ON ${2:table1}.${3:column} = ${1:table2}.${4:column}",
						detail: "Join two tables",
					},
					{
						label: "GROUP BY",
						insertText: "GROUP BY ${1:column}",
						detail: "Group results by column",
					},
					{
						label: "ORDER BY",
						insertText: "ORDER BY ${1:column} ${2|ASC,DESC|}",
						detail: "Sort results",
					},
				];

				snippets.forEach((snippet) => {
					if (!uniqueSuggestions.has(snippet.label)) {
						uniqueSuggestions.set(snippet.label, {
							label: snippet.label,
							kind: monaco.languages.CompletionItemKind.Snippet,
							insertText: snippet.insertText,
							insertTextRules:
								monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
							documentation: snippet.detail,
							range: range,
							sortText: "6" + snippet.label,
						});
					}
				});

				return { suggestions: Array.from(uniqueSuggestions.values()) };
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
		<Card className="h-full flex flex-col overflow-hidden">
			<CardHeader className="pb-4 flex-shrink-0">
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
			<CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
				<div className="flex-1 min-h-0 monaco-editor-container">
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
				<div className="px-4 pb-4 pt-2 text-xs text-muted-foreground border-t border-border flex-shrink-0">
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