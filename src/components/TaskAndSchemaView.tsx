import { Database, FileText } from "lucide-react";
import type React from "react";
import type { Task } from "@/types/task";
import DatabaseSchema from "./DatabaseSchema";
import TaskDescription from "./TaskDescription";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface TaskAndSchemaViewProps {
	task: Task;
}

const TaskAndSchemaView: React.FC<TaskAndSchemaViewProps> = ({ task }) => {
	return (
		<Tabs defaultValue="task" className="h-full flex flex-col">
			<TabsList className="w-full flex h-10">
				<TabsTrigger
					value="task"
					className="flex-1 flex items-center justify-center gap-2"
				>
					<FileText className="w-4 h-4" />
					<span>Task Description</span>
				</TabsTrigger>
				<TabsTrigger
					value="schema"
					className="flex-1 flex items-center justify-center gap-2"
				>
					<Database className="w-4 h-4" />
					<span>ER Diagram</span>
				</TabsTrigger>
			</TabsList>
			<TabsContent value="task" className="flex-1 overflow-auto mt-4">
				<TaskDescription task={task} />
			</TabsContent>
			<TabsContent value="schema" className="flex-1 h-full mt-4">
				<DatabaseSchema />
			</TabsContent>
		</Tabs>
	);
};

export { TaskAndSchemaView };
