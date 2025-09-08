import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CodeEditor } from "@/components/CodeEditor";
import { QueryResults } from "@/components/QueryResults";
import { TaskAndSchemaView } from "@/components/TaskAndSchemaView";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { executeTaskQuery, initTaskDatabase } from "@/lib/taskDatabase";
import { taskService } from "@/services/taskService";
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
	const [task, setTask] = useState<Task | null>(null);
	const [loading, setLoading] = useState(true);
	const [query, setQuery] = useState("");
	const [queryHistory, setQueryHistory] = useState<QueryExecution[]>([]);
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
							<CodeEditor
								value={query}
								onChange={setQuery}
								onRun={handleRunQuery}
							/>
						</ResizablePanel>
						<ResizableHandle withHandle />
						<ResizablePanel defaultSize={50} minSize={30}>
							<QueryResults queryHistory={queryHistory} />
						</ResizablePanel>
					</ResizablePanelGroup>
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
}
