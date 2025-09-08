import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { taskService } from "@/services/taskService";
import type { Task } from "@/types/task";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Clock, Database, Brain, Search, Star } from "lucide-react";

export function TaskListPage() {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");

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

	// Filter tasks based on search query
	const filteredTasks = tasks.filter(task =>
		task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
		task.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
		task.difficulty.toLowerCase().includes(searchQuery.toLowerCase())
	);

	// Separate featured/default tasks and other tasks
	// For now, treat the first 3 tasks as featured (you can update them in Firestore later)
	const defaultTasks = filteredTasks.filter(task => 
		task.isFeatured === true || 
		// Fallback: if no tasks are marked as featured, show the first 3
		(filteredTasks.filter(t => t.isFeatured).length === 0 && 
		 filteredTasks.indexOf(task) < 3)
	);
	
	const otherTasks = filteredTasks.filter(task => 
		!defaultTasks.includes(task)
	);

	const getDifficultyColor = (difficulty: string) => {
		switch (difficulty) {
			case "Easy":
				return "bg-green-500";
			case "Medium":
				return "bg-yellow-500";
			case "Hard":
				return "bg-red-500";
			default:
				return "bg-gray-500";
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="text-lg">Loading tasks...</div>
			</div>
		);
	}

	const TaskCard = ({ task, isFeatured = false }: { task: Task; isFeatured?: boolean }) => (
		<Link to={`/task/${task.id}`} className="block">
			<Card className="hover:shadow-lg transition-shadow cursor-pointer h-full relative">
				{isFeatured && (
					<div className="absolute top-3 right-3 z-10">
						<Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
					</div>
				)}
				<CardHeader>
					<div className="flex justify-between items-start mb-2">
						<Badge className={getDifficultyColor(task.difficulty)}>
							{task.difficulty}
						</Badge>
						<Badge variant="outline">{task.category}</Badge>
					</div>
					<CardTitle className="pr-6">{task.title}</CardTitle>
					<CardDescription className="line-clamp-2">
						{task.description.replace(/[#*`]/g, '').substring(0, 150)}...
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-2 text-sm text-gray-600">
						<div className="flex items-center gap-2">
							<Clock className="w-4 h-4" />
							<span>{task.timeEstimate}</span>
						</div>
						<div className="flex items-center gap-2">
							<Database className="w-4 h-4" />
							<span className="truncate">{task.tables.join(", ")}</span>
						</div>
						<div className="flex items-center gap-2">
							<Brain className="w-4 h-4" />
							<span className="truncate">{task.skills.slice(0, 3).join(", ")}</span>
						</div>
					</div>
				</CardContent>
			</Card>
		</Link>
	);

	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
			<div className="container mx-auto py-8 px-4 max-w-7xl">
				{/* Header */}
				<div className="mb-8 text-center">
					<h1 className="text-4xl font-bold mb-2">SQL Interview Challenges</h1>
					<p className="text-gray-600 mb-6">Practice your SQL skills with real-world scenarios</p>
					
					{/* Search Bar */}
					<div className="max-w-md mx-auto relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
						<Input
							type="text"
							placeholder="Search by title, category, or difficulty..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-10 pr-4 py-2 w-full"
						/>
					</div>
				</div>

				{/* Featured/Default Tasks Section */}
				{defaultTasks.length > 0 && (
					<div className="mb-12">
						<div className="flex items-center gap-2 mb-4">
							<Star className="w-5 h-5 text-yellow-500" />
							<h2 className="text-2xl font-semibold">Featured Challenges</h2>
						</div>
						<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
							{defaultTasks.map((task) => (
								<TaskCard key={task.id} task={task} isFeatured={true} />
							))}
						</div>
					</div>
				)}

				{/* All Other Tasks Section */}
				{otherTasks.length > 0 && (
					<div>
						<h2 className="text-2xl font-semibold mb-4">All Challenges</h2>
						<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
							{otherTasks.map((task) => (
								<TaskCard key={task.id} task={task} />
							))}
						</div>
					</div>
				)}

				{/* No Results Message */}
				{filteredTasks.length === 0 && !loading && (
					<div className="text-center py-12">
						<p className="text-gray-500 text-lg">No challenges found matching "{searchQuery}"</p>
						<button 
							onClick={() => setSearchQuery("")}
							className="mt-4 text-blue-600 hover:text-blue-700 underline"
						>
							Clear search
						</button>
					</div>
				)}

				{/* Empty State */}
				{tasks.length === 0 && !loading && searchQuery === "" && (
					<div className="text-center py-12">
						<Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
						<p className="text-gray-500 text-lg">No challenges available yet</p>
						<p className="text-gray-400 mt-2">Check back later for new SQL challenges!</p>
					</div>
				)}
			</div>
		</div>
	);
}