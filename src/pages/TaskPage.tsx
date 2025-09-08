import { useCallback, useEffect, useState, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { CodeEditor } from "@/components/CodeEditor";
import { QueryResults } from "@/components/QueryResults";
import { SessionManager } from "@/components/SessionManager";
import { TaskAndSchemaView } from "@/components/TaskAndSchemaView";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useCollaborationSession } from "@/hooks/useCollaborationSession";
import { executeTaskQuery, initTaskDatabase } from "@/lib/taskDatabase";
import { taskService } from "@/services/taskService";
import type { QueryResultsState } from "@/types/session";
import type { Task } from "@/types/task";

interface QueryExecution {
	id: string;
	query: string;
	result: any;
	error: string | null;
	executionTime: number;
	timestamp: Date;
}

export function TaskPage() {
	const { taskId } = useParams<{ taskId: string }>();
	const [searchParams] = useSearchParams();
	const sessionIdFromUrl = searchParams.get("session");

	const [task, setTask] = useState<Task | null>(null);
	const [loading, setLoading] = useState(true);
	const [query, setQuery] = useState("");
	const [queryHistory, setQueryHistory] = useState<QueryExecution[]>([]);
	const [isExecuting, setIsExecuting] = useState(false);
	const [isRemoteUpdate, setIsRemoteUpdate] = useState(false);
	const [pendingSessionId, setPendingSessionId] = useState<string | null>(null);
	
	// Use refs to always get current values in callbacks
	const isConnectedRef = useRef(false);
	const isRemoteUpdateRef = useRef(false);

	const {
		session,
		sessionId,
		user,
		isConnected,
		isLoading: sessionLoading,
		error: sessionError,
		createSession,
		joinSession,
		updateEditorContent,
		updateQueryResults,
		updateSelectedChallenge,
		updateCursorPosition,
		updateSelection,
		leaveSession,
		updateUserName,
	} = useCollaborationSession();

	useEffect(() => {
		if (taskId) {
			loadTask(taskId);
		}
	}, [taskId]);

	useEffect(() => {
		if (sessionIdFromUrl && !isConnected && !pendingSessionId) {
			// Store the session ID to join after user enters their name
			setPendingSessionId(sessionIdFromUrl);
		}
	}, [sessionIdFromUrl, isConnected, pendingSessionId]);

	// Keep refs updated
	useEffect(() => {
		isConnectedRef.current = isConnected;
	}, [isConnected]);
	
	useEffect(() => {
		isRemoteUpdateRef.current = isRemoteUpdate;
	}, [isRemoteUpdate]);

	useEffect(() => {
		if (
			session?.editor?.content !== undefined &&
			session.editor.content !== query
		) {
			setIsRemoteUpdate(true);
			setQuery(session.editor.content);
			// Reset the flag after a short delay to allow the editor to update
			setTimeout(() => setIsRemoteUpdate(false), 100);
		}
	}, [session?.editor?.content]);

	useEffect(() => {
		if (session?.queryResults) {
			const newExecution: QueryExecution = {
				id: `session_${session.queryResults.timestamp}`,
				query: session.editor.content,
				result: session.queryResults.results,
				error: session.queryResults.error,
				executionTime: session.queryResults.executionTime,
				timestamp: new Date(session.queryResults.timestamp),
			};

			setQueryHistory((prev) => {
				const exists = prev.some((h) => h.id === newExecution.id);
				if (!exists) {
					return [newExecution, ...prev];
				}
				return prev;
			});
		}
	}, [session?.queryResults, session?.editor?.content]);

	async function loadTask(id: string) {
		try {
			setLoading(true);
			const taskData = await taskService.getTaskById(id);
			if (taskData) {
				setTask(taskData);
				await initTaskDatabase(taskData);
			}
		} catch (error) {
			console.error("Failed to load task:", error);
		} finally {
			setLoading(false);
		}
	}

	const handleQueryChange = useCallback(
		(newValue: string) => {
			setQuery(newValue);
			if (isConnected) {
				updateEditorContent(newValue);
			}
		},
		[isConnected, updateEditorContent],
	);

	const handleCursorChange = useCallback(
		(line: number, column: number) => {
			console.log('handleCursorChange called:', { 
				line, column, 
				isConnected: isConnectedRef.current,
				isRemoteUpdate: isRemoteUpdateRef.current
			});
			// Don't update cursor position if this is a remote update
			// Use ref to get current value
			if (isConnectedRef.current && !isRemoteUpdateRef.current) {
				console.log('Updating cursor position to Firebase');
				updateCursorPosition(line, column);
			}
		},
		[updateCursorPosition],
	);

	const handleSelectionChange = useCallback(
		(startLine: number, startColumn: number, endLine: number, endColumn: number) => {
			console.log('handleSelectionChange called:', { 
				startLine, startColumn, endLine, endColumn, 
				isConnected: isConnectedRef.current, 
				isRemoteUpdate: isRemoteUpdateRef.current 
			});
			// Don't update selection if this is a remote update
			// Use ref to get current value
			if (isConnectedRef.current && !isRemoteUpdateRef.current) {
				console.log('Updating selection to Firebase');
				updateSelection(startLine, startColumn, endLine, endColumn);
			}
		},
		[updateSelection],
	);

	const handleRunQuery = async () => {
		if (!query.trim()) return;

		setIsExecuting(true);

		const { result, error, executionTime } = await executeTaskQuery(query);

		const newExecution: QueryExecution = {
			id: Date.now().toString(),
			query: query,
			result: result,
			error: error,
			executionTime: executionTime,
			timestamp: new Date(),
		};

		setQueryHistory((prev) => [newExecution, ...prev]);

		if (isConnected) {
			const queryResultsState: QueryResultsState = {
				results: result,
				error: error,
				executionTime: executionTime,
				timestamp: Date.now(),
			};
			updateQueryResults(queryResultsState);
		}

		setIsExecuting(false);
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="text-lg">Loading task...</div>
			</div>
		);
	}

	if (!task) {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="text-lg">Task not found</div>
			</div>
		);
	}

	return (
		<div className="h-screen flex flex-col">
			<div className="border-b px-4 py-2">
				<h1 className="text-xl font-semibold">{task.title}</h1>
			</div>

			<ResizablePanelGroup direction="horizontal" className="flex-1">
				<ResizablePanel defaultSize={40} minSize={30}>
					<div className="h-full flex flex-col">
						<div className="p-4 border-b">
							<SessionManager
								session={session}
								sessionId={sessionId}
								user={user}
								isConnected={isConnected}
								isLoading={sessionLoading}
								error={sessionError}
								selectedChallenge={taskId || "default"}
								pendingSessionId={pendingSessionId}
								onCreateSession={createSession}
								onJoinSession={(sessionId) => {
									setPendingSessionId(null);
									return joinSession(sessionId);
								}}
								onLeaveSession={leaveSession}
								onUpdateUserName={updateUserName}
							/>
						</div>
						<div className="flex-1 overflow-auto">
							<TaskAndSchemaView task={task} />
						</div>
					</div>
				</ResizablePanel>
				<ResizableHandle withHandle />
				<ResizablePanel defaultSize={60} minSize={30}>
					<ResizablePanelGroup direction="vertical">
						<ResizablePanel defaultSize={50} minSize={30}>
							<CodeEditor
								value={query}
								onChange={handleQueryChange}
								onRun={handleRunQuery}
								isCollaborating={isConnected}
								participants={
									session?.participants
										? Object.values(session.participants)
										: []
								}
								cursorPositions={session?.editor?.cursorPositions || {}}
								selections={session?.editor?.selections || {}}
								onCursorChange={handleCursorChange}
								onSelectionChange={handleSelectionChange}
								currentUserId={user?.id}
							/>
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel defaultSize={50} minSize={30}>
							<QueryResults
								queryHistory={queryHistory}
								isCollaborating={isConnected}
							/>
						</ResizablePanel>
					</ResizablePanelGroup>
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
}
