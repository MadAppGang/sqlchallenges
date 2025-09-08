import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { taskService } from "@/services/taskService";
import type { Task } from "@/types/task";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Clock, Database, Code2, Search, Star, TrendingUp, Users, BookOpen } from "lucide-react";

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
				return "bg-emerald-100 text-emerald-700 border-emerald-200";
			case "Medium":
				return "bg-amber-100 text-amber-700 border-amber-200";
			case "Hard":
				return "bg-rose-100 text-rose-700 border-rose-200";
			default:
				return "bg-gray-100 text-gray-700 border-gray-200";
		}
	};

	const getCategoryIcon = (category: string) => {
		if (category.includes("Basic")) return <BookOpen className="w-4 h-4" />;
		if (category.includes("Aggregation") || category.includes("Analysis")) return <TrendingUp className="w-4 h-4" />;
		if (category.includes("Advanced")) return <Code2 className="w-4 h-4" />;
		return <Database className="w-4 h-4" />;
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-pulse flex flex-col items-center">
						<Database className="w-12 h-12 text-blue-500 mb-4" />
						<p className="text-lg text-gray-600">Loading challenges...</p>
					</div>
				</div>
			</div>
		);
	}

	const TaskCard = ({ task, isFeatured = false }: { task: Task; isFeatured?: boolean }) => (
		<Link to={`/task/${task.id}`} className="block group">
			<div className={`
				relative p-4 rounded-lg border transition-all duration-200
				${isFeatured 
					? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 hover:border-blue-300 hover:shadow-md' 
					: 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
				}
			`}>
				{isFeatured && (
					<Star className="absolute top-4 right-4 w-4 h-4 text-yellow-500 fill-yellow-500" />
				)}
				
				<div className="flex items-start justify-between mb-3">
					<h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors pr-8">
						{task.title}
					</h3>
				</div>

				<p className="text-sm text-gray-600 mb-3 line-clamp-2">
					{task.description.replace(/[#*`]/g, '').replace(/## \w+.*$/gm, '').trim().substring(0, 120)}...
				</p>

				<div className="flex items-center gap-4 text-xs">
					<Badge className={`${getDifficultyColor(task.difficulty)} border`}>
						{task.difficulty}
					</Badge>
					
					<div className="flex items-center gap-1 text-gray-500">
						{getCategoryIcon(task.category)}
						<span>{task.category}</span>
					</div>
					
					<div className="flex items-center gap-1 text-gray-500">
						<Clock className="w-3 h-3" />
						<span>{task.timeEstimate}</span>
					</div>
					
					<div className="flex items-center gap-1 text-gray-500 ml-auto">
						<Database className="w-3 h-3" />
						<span>{task.tables.length} tables</span>
					</div>
				</div>
			</div>
		</Link>
	);

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
			<div className="container mx-auto py-6 px-4 max-w-6xl">
				{/* Header */}
				<div className="mb-8">
					<div className="flex items-center justify-between mb-6">
						<div>
							<h1 className="text-3xl font-bold text-gray-900">SQL Challenge Hub</h1>
							<p className="text-gray-600 mt-1">Master SQL with real-world scenarios</p>
						</div>
						<div className="flex items-center gap-2 text-sm text-gray-500">
							<Users className="w-4 h-4" />
							<span>{tasks.length} challenges available</span>
						</div>
					</div>
					
					{/* Search Bar */}
					<div className="relative max-w-xl">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
						<Input
							type="text"
							placeholder="Search challenges..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-9 pr-4 py-2 w-full bg-white border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
						/>
					</div>
				</div>

				{/* Featured Tasks Section */}
				{defaultTasks.length > 0 && (
					<div className="mb-8">
						<div className="flex items-center gap-2 mb-4">
							<Star className="w-4 h-4 text-yellow-500" />
							<h2 className="text-lg font-semibold text-gray-800">Featured Challenges</h2>
						</div>
						<div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
							{defaultTasks.map((task) => (
								<TaskCard key={task.id} task={task} isFeatured={true} />
							))}
						</div>
					</div>
				)}

				{/* All Other Tasks Section */}
				{otherTasks.length > 0 && (
					<div>
						<h2 className="text-lg font-semibold text-gray-800 mb-4">More Challenges</h2>
						<div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
							{otherTasks.map((task) => (
								<TaskCard key={task.id} task={task} />
							))}
						</div>
					</div>
				)}

				{/* No Results Message */}
				{filteredTasks.length === 0 && !loading && (
					<div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
						<Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
						<p className="text-gray-600 mb-2">No challenges found matching "{searchQuery}"</p>
						<button 
							onClick={() => setSearchQuery("")}
							className="text-sm text-blue-600 hover:text-blue-700 font-medium"
						>
							Clear search
						</button>
					</div>
				)}

				{/* Empty State */}
				{tasks.length === 0 && !loading && searchQuery === "" && (
					<div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
						<Database className="w-12 h-12 text-gray-300 mx-auto mb-4" />
						<p className="text-gray-600 font-medium mb-2">No challenges available</p>
						<p className="text-gray-500 text-sm">Check back later for new SQL challenges!</p>
					</div>
				)}
			</div>
		</div>
	);
}