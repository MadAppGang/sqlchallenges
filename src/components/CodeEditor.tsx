import Editor, { type Monaco } from "@monaco-editor/react";
import { Play } from "lucide-react";
import type { editor } from "monaco-editor";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { databaseSchema } from "../lib/databaseSchema";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface CodeEditorProps {
	value: string;
	onChange: (value: string) => void;
	onRun: () => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
	value,
	onChange,
	onRun,
}) => {
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
		onChange(value || "");
	};

	const handleRunQuery = () => {
		onRun();
	};

	// Handle keyboard shortcut
	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
				e.preventDefault();
				handleRunQuery();
			}
		},
		[value],
	);

	useEffect(() => {
		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [handleKeyDown]);

	const handleEditorDidMount = (
		editor: editor.IStandaloneCodeEditor,
		monaco: Monaco,
	) => {
		editorRef.current = editor;
		monacoRef.current = monaco;

		// Configure SQL language features
		monaco.languages.registerCompletionItemProvider("sql", {
			provideCompletionItems: (model, position) => {
				const word = model.getWordUntilPosition(position);
				const range = {
					startLineNumber: position.lineNumber,
					endLineNumber: position.lineNumber,
					startColumn: word.startColumn,
					endColumn: word.endColumn,
				};

				// Create suggestions from schema
				const suggestions: any[] = [];

				// Add table suggestions
				for (const table of databaseSchema.tables) {
					suggestions.push({
						label: table.name,
						kind: monaco.languages.CompletionItemKind.Class,
						documentation: `Table: ${table.name}`,
						insertText: table.name,
						range: range,
					});

					// Add column suggestions for each table
					for (const column of table.columns) {
						suggestions.push({
							label: `${table.name}.${column.name}`,
							kind: monaco.languages.CompletionItemKind.Field,
							documentation: `${column.type}${column.constraints ? ` (${column.constraints})` : ""}`,
							insertText: `${table.name}.${column.name}`,
							range: range,
						});
					}
				}

				// Add common SQL keywords
				const keywords = [
					"SELECT",
					"FROM",
					"WHERE",
					"JOIN",
					"LEFT JOIN",
					"RIGHT JOIN",
					"INNER JOIN",
					"GROUP BY",
					"ORDER BY",
					"HAVING",
					"LIMIT",
					"OFFSET",
					"AS",
					"ON",
					"AND",
					"OR",
					"NOT",
					"IN",
					"EXISTS",
					"BETWEEN",
					"LIKE",
					"COUNT",
					"SUM",
					"AVG",
					"MAX",
					"MIN",
					"DISTINCT",
					"CASE",
					"WHEN",
					"THEN",
					"ELSE",
					"END",
				];

				for (const keyword of keywords) {
					suggestions.push({
						label: keyword,
						kind: monaco.languages.CompletionItemKind.Keyword,
						insertText: keyword,
						range: range,
					});
				}

				return { suggestions };
			},
		});

		// Auto-format on paste
		editor.onDidPaste(() => {
			editor.getAction("editor.action.formatDocument")?.run();
		});
	};

	return (
		<Card className="h-full flex flex-col">
			<CardHeader className="pb-3 flex-shrink-0">
				<div className="flex items-center justify-between">
					<CardTitle className="text-base">SQL Editor</CardTitle>
					<Button
						onClick={handleRunQuery}
						size="sm"
						className="gap-2"
					>
						<Play className="w-3 h-3" />
						Run Query
						<kbd className="ml-1 pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:inline-flex">
							<span className="text-xs">⌘</span>Enter
						</kbd>
					</Button>
				</div>
			</CardHeader>
			<CardContent className="flex-1 overflow-hidden p-0">
				<Editor
					height="100%"
					defaultLanguage="sql"
					value={value}
					onChange={handleQueryChange}
					onMount={handleEditorDidMount}
					theme={theme}
					options={{
						minimap: { enabled: false },
						fontSize: 14,
						lineNumbers: "on",
						scrollBeyondLastLine: false,
						automaticLayout: true,
						tabSize: 2,
						wordWrap: "on",
						suggestOnTriggerCharacters: true,
						quickSuggestions: true,
						formatOnPaste: true,
						formatOnType: true,
						padding: { top: 16, bottom: 16 },
						scrollbar: {
							vertical: "visible",
							horizontal: "visible",
							useShadows: false,
							verticalScrollbarSize: 10,
							horizontalScrollbarSize: 10,
						},
					}}
				/>
			</CardContent>
		</Card>
	);
};

export default CodeEditor;