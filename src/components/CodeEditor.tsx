import Editor, { type Monaco } from "@monaco-editor/react";
import { Play, Users } from "lucide-react";
import type { editor } from "monaco-editor";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Participant, CursorPosition, SelectionRange } from "@/types/session";
import { databaseSchema } from "../lib/databaseSchema";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import "../styles/editor-cursors.css";

interface CodeEditorProps {
	value: string;
	onChange: (value: string) => void;
	onRun: () => void;
	isCollaborating?: boolean;
	participants?: Participant[];
	cursorPositions?: Record<string, CursorPosition>;
	selections?: Record<string, SelectionRange>;
	onCursorChange?: (line: number, column: number) => void;
	onSelectionChange?: (startLine: number, startColumn: number, endLine: number, endColumn: number) => void;
	currentUserId?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
	value,
	onChange,
	onRun,
	isCollaborating = false,
	participants = [],
	cursorPositions = {},
	selections = {},
	onCursorChange,
	onSelectionChange,
	currentUserId,
}) => {
	const [theme, setTheme] = useState<"vs" | "vs-dark">("vs");
	const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
	const monacoRef = useRef<Monaco | null>(null);
	const cursorDecorationsRef = useRef<string[]>([]);
	const cursorWidgetsRef = useRef<Map<string, any>>(new Map());
	const selectionDecorationsRef = useRef<string[]>([]);

	// Always use light theme for consistency
	useEffect(() => {
		setTheme("vs");
	}, []);

	const handleQueryChange = (value: string | undefined) => {
		onChange(value || "");
	};

	// Track cursor and selection changes - now handled in handleEditorDidMount
	// Keeping this effect empty but present for potential future use
	useEffect(() => {
		// Listeners are now set up in handleEditorDidMount to ensure editor is ready
		return () => {
			// Cleanup if needed in future
		};
	}, [onCursorChange, onSelectionChange]);

	// Render other users' cursors
	useEffect(() => {
		if (!editorRef.current || !monacoRef.current || !isCollaborating) return;

		const editor = editorRef.current;
		const monaco = monacoRef.current;
		

		// Clear previous decorations
		if (cursorDecorationsRef.current.length > 0) {
			editor.deltaDecorations(cursorDecorationsRef.current, []);
			cursorDecorationsRef.current = [];
		}

		// Clear previous widgets
		cursorWidgetsRef.current.forEach((widget) => {
			editor.removeContentWidget(widget);
		});
		cursorWidgetsRef.current.clear();

		// Add new cursor decorations for each participant
		const newDecorations: any[] = [];

		Object.entries(cursorPositions || {}).forEach(([userId, position]) => {
			// Skip current user's cursor - we don't need to show our own cursor
			if (userId === currentUserId) return;

			const participant = participants.find(p => p.id === userId);
			if (!participant || !participant.isActive) return;

			// Check if user has an active selection (not just a cursor position)
			const userSelection = selections?.[userId];
			const hasSelection = userSelection && 
				(userSelection.startLine !== userSelection.endLine || 
				 userSelection.startColumn !== userSelection.endColumn);

			// Only skip cursor if user has a multi-character selection
			if (hasSelection) {
				return;
			}

			// Create cursor widget
			const cursorWidget = {
				getId: () => `cursor-${userId}`,
				getDomNode: () => {
					const container = document.createElement('div');
					container.className = 'user-cursor';
					
					// Create cursor line
					const cursorLine = document.createElement('div');
					cursorLine.className = 'user-cursor-line';
					cursorLine.style.backgroundColor = participant.color;
					
					// Create label
					const label = document.createElement('div');
					label.className = 'user-cursor-label';
					label.style.backgroundColor = participant.color;
					label.textContent = participant.name;
					
					container.appendChild(cursorLine);
					container.appendChild(label);
					
					return container;
				},
				getPosition: () => ({
					position: {
						lineNumber: position.line,
						column: position.column,
					},
					preference: [monaco.editor.ContentWidgetPositionPreference.EXACT],
				}),
			};

			editor.addContentWidget(cursorWidget);
			cursorWidgetsRef.current.set(userId, cursorWidget);
		});

		return () => {
			// Cleanup
			if (cursorDecorationsRef.current.length > 0) {
				editor.deltaDecorations(cursorDecorationsRef.current, []);
				cursorDecorationsRef.current = [];
			}
			cursorWidgetsRef.current.forEach((widget) => {
				editor.removeContentWidget(widget);
			});
			cursorWidgetsRef.current.clear();
		};
	}, [cursorPositions, participants, currentUserId, isCollaborating, selections]);

	// Render selections
	const selectionWidgetsRef = useRef<Map<string, any>>(new Map());
	
	useEffect(() => {
		if (!editorRef.current || !monacoRef.current || !isCollaborating) return;

		const editor = editorRef.current;
		const monaco = monacoRef.current;
		

		// Clear previous selection decorations
		if (selectionDecorationsRef.current.length > 0) {
			editor.deltaDecorations(selectionDecorationsRef.current, []);
			selectionDecorationsRef.current = [];
		}
		
		// Clear previous selection widgets
		selectionWidgetsRef.current.forEach((widget) => {
			editor.removeContentWidget(widget);
		});
		selectionWidgetsRef.current.clear();

		// Add new selection decorations
		const newDecorations: any[] = [];

		Object.entries(selections || {}).forEach(([userId, selection]) => {
			// Skip current user's selection
			if (userId === currentUserId) return;

			const participant = participants.find(p => p.id === userId);
			if (!participant || !participant.isActive) return;

			// Create a semi-transparent version of the user's color
			const rgbaColor = hexToRgba(participant.color, 0.25);

			// Create a unique class name for this user's selection
			const selectionClassName = `user-selection-${userId.replace(/[^a-zA-Z0-9]/g, '-')}`;
			
			// Inject CSS for this specific user's selection color
			const styleId = `selection-style-${userId}`;
			let styleElement = document.getElementById(styleId) as HTMLStyleElement;
			if (!styleElement) {
				styleElement = document.createElement('style');
				styleElement.id = styleId;
				document.head.appendChild(styleElement);
			}
			styleElement.textContent = `
				.${selectionClassName} {
					background-color: ${rgbaColor} !important;
				}
			`;

			newDecorations.push({
				range: new monaco.Range(
					selection.startLine,
					selection.startColumn,
					selection.endLine,
					selection.endColumn
				),
				options: {
					className: selectionClassName,
					stickiness: monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
					isWholeLine: false,
					// Add overview ruler marker
					overviewRuler: {
						color: participant.color,
						position: monaco.editor.OverviewRulerLane.Full
					},
					// Add minimap marker
					minimap: {
						color: participant.color,
						position: monaco.editor.MinimapPosition.Inline
					}
				}
			});
			
			// Add selection label widget
			const selectionWidget = {
				getId: () => `selection-label-${userId}`,
				getDomNode: () => {
					const container = document.createElement('div');
					container.className = 'user-selection-label';
					container.style.backgroundColor = participant.color;
					container.style.color = 'white';
					container.style.padding = '2px 6px';
					container.style.borderRadius = '3px';
					container.style.fontSize = '11px';
					container.style.fontWeight = '500';
					container.style.whiteSpace = 'nowrap';
					container.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
					container.style.fontFamily = 'system-ui, -apple-system, sans-serif';
					container.style.position = 'absolute';
					container.style.zIndex = '1000';
					container.textContent = participant.name;
					
					return container;
				},
				getPosition: () => ({
					position: {
						lineNumber: selection.startLine,
						column: selection.startColumn,
					},
					preference: [monaco.editor.ContentWidgetPositionPreference.ABOVE],
				}),
			};

			editor.addContentWidget(selectionWidget);
			selectionWidgetsRef.current.set(userId, selectionWidget);
		});

		selectionDecorationsRef.current = editor.deltaDecorations([], newDecorations);

		return () => {
			if (selectionDecorationsRef.current.length > 0) {
				editor.deltaDecorations(selectionDecorationsRef.current, []);
				selectionDecorationsRef.current = [];
			}
			selectionWidgetsRef.current.forEach((widget) => {
				editor.removeContentWidget(widget);
			});
			selectionWidgetsRef.current.clear();
		};
	}, [selections, participants, currentUserId, isCollaborating]);

	// Helper function to convert hex to rgba
	const hexToRgba = (hex: string, alpha: number) => {
		const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result
			? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${alpha})`
			: `rgba(128, 128, 128, ${alpha})`;
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

		// Set up cursor and selection listeners here where we know the editor is ready
		if (onCursorChange) {
			editor.onDidChangeCursorPosition((e) => {
				const position = e.position;
				onCursorChange(position.lineNumber, position.column);
			});
		}

		if (onSelectionChange) {
			editor.onDidChangeCursorSelection((e) => {
				const selection = e.selection;
				onSelectionChange(
					selection.startLineNumber,
					selection.startColumn,
					selection.endLineNumber,
					selection.endColumn
				);
			});
		}

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
				for (const table of databaseSchema) {
					suggestions.push({
						label: table.tableName,
						kind: monaco.languages.CompletionItemKind.Class,
						documentation: `Table: ${table.tableName}`,
						insertText: table.tableName,
						range: range,
					});

					// Add column suggestions for each table
					for (const column of table.columns) {
						suggestions.push({
							label: `${table.tableName}.${column.name}`,
							kind: monaco.languages.CompletionItemKind.Field,
							documentation: `${column.type}${column.description ? ` - ${column.description}` : ""}`,
							insertText: `${table.tableName}.${column.name}`,
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
					<div className="flex items-center gap-2">
						<CardTitle className="text-base">SQL Editor</CardTitle>
						{isCollaborating && (
							<Badge variant="outline" className="text-xs">
								<Users className="w-3 h-3 mr-1" />
								{participants.filter((p) => p.isActive).length} editing
							</Badge>
						)}
					</div>
					<Button onClick={handleRunQuery} size="sm" className="gap-2">
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
						fontFamily: "'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace",
						lineNumbers: "on",
						scrollBeyondLastLine: false,
						automaticLayout: true,
						tabSize: 2,
						wordWrap: "on",
						suggestOnTriggerCharacters: true,
						quickSuggestions: true,
						formatOnPaste: true,
						formatOnType: true,
						padding: { top: 30, bottom: 16 },
						scrollbar: {
							vertical: "visible",
							horizontal: "visible",
							useShadows: false,
							verticalScrollbarSize: 10,
							horizontalScrollbarSize: 10,
						},
						renderWhitespace: "selection",
						cursorBlinking: "smooth",
					}}
				/>
			</CardContent>
		</Card>
	);
};

export default CodeEditor;
