import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "@/components/ui/resizable";
import { taskService } from "@/services/taskService";
import { initTaskDatabase, executeTaskQuery } from "@/lib/taskDatabase";
import type { Task } from "@/types/task";
import { TaskAndSchemaView } from "@/components/TaskAndSchemaView";
import { CodeEditor } from "@/components/CodeEditor";
import { QueryResults } from "@/components/QueryResults";

export function TaskPage() {
	const { taskId } = useParams<{ taskId: string }>();
	const [task, setTask] = useState<Task | null>(null);
	const [loading, setLoading] = useState(true);
	const [query, setQuery] = useState("");
	const [queryResult, setQueryResult] = useState<any>(null);
	const [queryError, setQueryError] = useState<string | null>(null);
	const [executionTime, setExecutionTime] = useState<number>(0);
	const [isExecuting, setIsExecuting] = useState(false);

	useEffect(() => {
		if (taskId) {
			loadTask(taskId);
		}
	}, [taskId]);

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

	const handleRunQuery = async () => {
		if (!query.trim()) return;

		setIsExecuting(true);
		setQueryError(null);

		const { result, error, executionTime } = await executeTaskQuery(query);

		setQueryResult(result);
		setQueryError(error);
		setExecutionTime(executionTime);
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
					<TaskAndSchemaView task={task} />
				</ResizablePanel>
				<ResizableHandle withHandle />
				<ResizablePanel defaultSize={60} minSize={30}>
					<ResizablePanelGroup direction="vertical">
						<ResizablePanel defaultSize={50} minSize={30}>
							<CodeEditor value={query} onChange={setQuery} onRun={handleRunQuery} />
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel defaultSize={50} minSize={30}>
							<QueryResults
								result={queryResult}
								error={queryError}
								executionTime={executionTime}
							/>
						</ResizablePanel>
					</ResizablePanelGroup>
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
}