import { Share2, Users } from "lucide-react";
import { useState } from "react";
import CodeEditor from "./components/CodeEditor";
import DataStructure from "./components/DataStructure";
import QueryResults from "./components/QueryResults";
import TaskDescription from "./components/TaskDescription";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "./components/ui/resizable";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./components/ui/select";
import { executeSqlQuery, mockChallenges } from "./data/mockChallenges";

export default function App() {
	const [currentChallengeId, setCurrentChallengeId] = useState(1);
	const [queryResults, setQueryResults] = useState<
		Record<string, string | number | null>[]
	>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [currentQuery, setCurrentQuery] = useState("");
	const [queryError, setQueryError] = useState<string | undefined>();
	const [executionTime, setExecutionTime] = useState<number | undefined>();

	// Mock collaboration data
	const collaborators = [
		{ name: "Alice", color: "#3B82F6" },
		{ name: "Bob", color: "#10B981" },
	];

	const currentChallenge = mockChallenges.find(
		(c) => c.id === currentChallengeId,
	);

	const handleChallengeSelect = (challengeId: string) => {
		const id = parseInt(challengeId, 10);
		setCurrentChallengeId(id);
		setQueryResults([]);
		setCurrentQuery("");
		setQueryError(undefined);
		setExecutionTime(undefined);
	};

	const handleQueryChange = (query: string) => {
		setCurrentQuery(query);
	};

	const handleRunQuery = async (query: string) => {
		setIsLoading(true);
		setQueryError(undefined);
		const startTime = Date.now();

		try {
			const results = await executeSqlQuery(query);
			setQueryResults(results);
			setExecutionTime(Date.now() - startTime);
		} catch (error) {
			console.error("Query execution failed:", error);
			setQueryError(
				error instanceof Error ? error.message : "An unknown error occurred",
			);
			setQueryResults([]);
			setExecutionTime(undefined);
		} finally {
			setIsLoading(false);
		}
	};

	const handleShare = () => {
		const shareUrl = `${window.location.origin}${window.location.pathname}?session=abc123`;
		navigator.clipboard.writeText(shareUrl);
		// In a real app, you'd show a toast notification here
		alert("Collaboration link copied to clipboard!");
	};

	if (!currentChallenge) {
		return <div>Challenge not found</div>;
	}

	return (
		<div className="h-screen bg-background">
			{/* Header */}
			<div className="border-b border-border bg-card">
				<div className="flex items-center justify-between p-4">
					<div className="flex items-center gap-4">
						<h1 className="text-xl">SQL Interview Challenges</h1>
						<Select
							value={currentChallengeId.toString()}
							onValueChange={handleChallengeSelect}
						>
							<SelectTrigger className="w-80">
								<SelectValue placeholder="Select a challenge" />
							</SelectTrigger>
							<SelectContent>
								{mockChallenges.map((challenge) => (
									<SelectItem
										key={challenge.id}
										value={challenge.id.toString()}
									>
										<div className="flex items-center gap-2">
											<Badge
												variant={
													challenge.difficulty === "Easy"
														? "secondary"
														: challenge.difficulty === "Medium"
															? "default"
															: "destructive"
												}
												className="text-xs"
											>
												{challenge.difficulty}
											</Badge>
											<span>{challenge.title}</span>
										</div>
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Badge variant="secondary" className="gap-1">
							<Users className="w-3 h-3" />
							{collaborators.length + 1} active
						</Badge>
					</div>
					<Button variant="outline" onClick={handleShare} className="gap-2">
						<Share2 className="w-4 h-4" />
						Share Session
					</Button>
				</div>
			</div>

			{/* Main Content */}
			<div className="h-[calc(100vh-73px)]">
				<ResizablePanelGroup direction="horizontal">
					{/* Left Panel - Task and Data Structure */}
					<ResizablePanel defaultSize={45} minSize={35} maxSize={55}>
						<ResizablePanelGroup direction="vertical">
							{/* Task Description */}
							<ResizablePanel defaultSize={40} minSize={25}>
								<div className="h-full p-4">
									<TaskDescription
										title={currentChallenge.title}
										difficulty={currentChallenge.difficulty}
										description={currentChallenge.description}
										expectedOutput={currentChallenge.expectedOutput}
									/>
								</div>
							</ResizablePanel>

							<ResizableHandle />

							{/* Data Structure */}
							<ResizablePanel defaultSize={60} minSize={40}>
								<div className="h-full p-4">
									<DataStructure tables={currentChallenge.tables} />
								</div>
							</ResizablePanel>
						</ResizablePanelGroup>
					</ResizablePanel>

					<ResizableHandle />

					{/* Right Panel - Code Editor and Results */}
					<ResizablePanel defaultSize={55} minSize={40}>
						<ResizablePanelGroup direction="vertical">
							{/* SQL Editor */}
							<ResizablePanel defaultSize={60} minSize={40}>
								<div className="h-full p-4">
									<CodeEditor
										initialQuery={currentQuery}
										onQueryChange={handleQueryChange}
										onRunQuery={handleRunQuery}
										isLoading={isLoading}
										collaborators={collaborators}
									/>
								</div>
							</ResizablePanel>

							<ResizableHandle />

							{/* Query Results */}
							<ResizablePanel defaultSize={40} minSize={25}>
								<div className="h-full p-4">
									<QueryResults
										results={queryResults}
										isLoading={isLoading}
										error={queryError}
										executionTime={executionTime}
									/>
								</div>
							</ResizablePanel>
						</ResizablePanelGroup>
					</ResizablePanel>
				</ResizablePanelGroup>
			</div>
		</div>
	);
}
