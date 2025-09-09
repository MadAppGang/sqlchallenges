import { get, ref } from "firebase/database";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ChallengesList, { type Challenge } from "@/components/ChallengesList";
import { realtimeDb } from "@/lib/firebase";
import { taskService } from "@/services/taskService";
import type { Task } from "@/types/task";

export function TaskListPage() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const [tasks, setTasks] = useState<Task[]>([]);
	const [loading, setLoading] = useState(true);

	const loadTasks = useCallback(async () => {
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
	}, []);

	const fetchSessionAndRedirect = useCallback(
		async (sessionId: string) => {
			try {
				const sessionRef = ref(realtimeDb, `sessions/${sessionId}`);
				const snapshot = await get(sessionRef);

				if (snapshot.exists()) {
					const sessionData = snapshot.val();
					const taskId = sessionData.selectedChallenge;

					if (taskId) {
						// Redirect to the task page with the session parameter
						navigate(`/task/${taskId}?session=${sessionId}`);
					} else {
						// If no task in session, just load the task list
						loadTasks();
					}
				} else {
					// Session not found, load normal task list
					console.warn("Session not found:", sessionId);
					loadTasks();
				}
			} catch (error) {
				console.error("Error fetching session:", error);
				loadTasks();
			}
		},
		[navigate, loadTasks],
	);

	useEffect(() => {
		// Check if there's a session parameter in the URL
		const sessionId = searchParams.get("session");
		if (sessionId) {
			// Fetch session data to get the task ID
			fetchSessionAndRedirect(sessionId);
		} else {
			loadTasks();
		}
	}, [searchParams, fetchSessionAndRedirect, loadTasks]);

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
