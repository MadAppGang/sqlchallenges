import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChallengesList, { type Challenge } from "@/components/ChallengesList";
import { taskService } from "@/services/taskService";
import type { Task } from "@/types/task";

export function TaskListPage() {
	const navigate = useNavigate();
	const [tasks, setTasks] = useState<Task[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		loadTasks();
	}, []);

	async function loadTasks() {
		try {
			setLoading(true);
			const publicTasks = await taskService.getPublicTasks();
			setTasks(publicTasks);
		} catch (error) {
			console.error("Failed to load tasks from Firestore:", error);
			setTasks([]);
		} finally {
			setLoading(false);
		}
	}

	// Convert Task[] to Challenge[] format
	// Create a map to store the relationship between challenge ID and task ID
	const taskIdMap = new Map<number, string>();
	
	const challenges: Challenge[] = tasks.map((task, index) => {
		const challengeId = index + 1;
		taskIdMap.set(challengeId, task.id);
		
		// Only show as featured if explicitly marked in the database
		const shouldBeFeatured = task.isFeatured === true;
		
		return {
			id: challengeId, // Using index as id since Challenge expects number
			title: task.title,
			difficulty: task.difficulty,
			status: "not-started" as const, // Default status - you can enhance this with user progress tracking
			description: task.description
				.replace(/[#*`]/g, "")
				.replace(/## \w+.*$/gm, "")
				.trim(),
			estimatedTime: task.timeEstimate,
			topics: task.skills,
			isFeatured: shouldBeFeatured,
			completionRate: Math.floor(Math.random() * 40 + 60), // Mock completion rate between 60-100%
		};
	});

	const handleChallengeSelect = (challengeId: number) => {
		// Find the actual task ID from our map
		const taskId = taskIdMap.get(challengeId);
		if (taskId) {
			navigate(`/task/${taskId}`);
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<p className="text-gray-500">Loading challenges...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="container mx-auto px-6 py-8">
				<ChallengesList
					challenges={challenges}
					onChallengeSelect={handleChallengeSelect}
					title="SQL Challenges"
					subtitle="Master SQL with real-world database problems"
					searchPlaceholder="Search challenges..."
					showSearch={true}
					showFilters={true}
					showFeatured={true}
					className="max-w-7xl mx-auto"
				/>
			</div>
		</div>
	);
}
