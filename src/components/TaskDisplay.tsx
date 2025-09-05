import type React from "react";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Clock, BookOpen, Database } from "lucide-react";
import type { ParsedTask } from "../lib/taskParser";

interface TaskDisplayProps {
	task: ParsedTask;
}

const TaskDisplay: React.FC<TaskDisplayProps> = ({ task }) => {
	const getDifficultyColor = (difficulty: string) => {
		switch (difficulty) {
			case "Easy":
				return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
			case "Medium":
				return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
			case "Hard":
				return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
		}
	};

	return (
		<div className="h-full overflow-auto">
			<div className="space-y-4 p-4">
				{/* Task Header */}
				<Card>
					<CardHeader>
						<div className="flex items-start justify-between mb-2">
							<CardTitle className="text-2xl">{task.metadata.title}</CardTitle>
							<Badge className={getDifficultyColor(task.metadata.difficulty)}>
								{task.metadata.difficulty}
							</Badge>
						</div>
						
						<div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
							<div className="flex items-center gap-1">
								<Clock className="w-4 h-4" />
								<span>{task.metadata.timeEstimate}</span>
							</div>
							<div className="flex items-center gap-1">
								<BookOpen className="w-4 h-4" />
								<span>{task.metadata.category}</span>
							</div>
							<div className="flex items-center gap-1">
								<Database className="w-4 h-4" />
								<span>{task.metadata.tables.length} tables</span>
							</div>
						</div>
					</CardHeader>
				</Card>

				{/* Required Skills */}
				<Card>
					<CardHeader>
						<CardTitle className="text-lg">Required Skills</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex flex-wrap gap-2">
							{task.metadata.skills.map((skill, index) => (
								<Badge key={index} variant="secondary">
									{skill}
								</Badge>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Task Content */}
				<Card>
					<CardHeader>
						<CardTitle className="text-lg">Task Description</CardTitle>
					</CardHeader>
					<CardContent>
						<div 
							className="prose prose-sm dark:prose-invert max-w-none"
							dangerouslySetInnerHTML={{ __html: task.htmlContent || task.content }}
						/>
					</CardContent>
				</Card>

				{/* Tables Used */}
				<Card>
					<CardHeader>
						<CardTitle className="text-lg">Tables Used</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-2 gap-2">
							{task.metadata.tables.map((table, index) => (
								<div
									key={index}
									className="flex items-center gap-2 p-2 rounded-md bg-muted"
								>
									<Database className="w-4 h-4 text-muted-foreground" />
									<span className="font-mono text-sm">{table}</span>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default TaskDisplay;