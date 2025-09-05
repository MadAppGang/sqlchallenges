import { CheckCircle, Circle, Lock } from "lucide-react";
import type React from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface Challenge {
	id: number;
	title: string;
	difficulty: "Easy" | "Medium" | "Hard";
	status: "completed" | "current" | "locked";
}

interface ChallengeListProps {
	challenges: Challenge[];
	currentChallenge: number;
	onChallengeSelect: (challengeId: number) => void;
}

const ChallengeList: React.FC<ChallengeListProps> = ({
	challenges,
	currentChallenge,
	onChallengeSelect,
}) => {
	const getDifficultyColor = (difficulty: string) => {
		switch (difficulty) {
			case "Easy":
				return "bg-green-100 text-green-800";
			case "Medium":
				return "bg-yellow-100 text-yellow-800";
			case "Hard":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "completed":
				return <CheckCircle className="w-4 h-4 text-green-600" />;
			case "current":
				return <Circle className="w-4 h-4 text-blue-600" />;
			case "locked":
				return <Lock className="w-4 h-4 text-gray-400" />;
			default:
				return <Circle className="w-4 h-4 text-gray-400" />;
		}
	};

	return (
		<div className="h-full bg-card border-r border-border p-4 flex flex-col">
			<h2 className="mb-4 text-lg">SQL Challenges</h2>
			<div className="space-y-2 flex-1">
				{challenges.map((challenge) => (
					<Button
						key={challenge.id}
						variant={currentChallenge === challenge.id ? "default" : "ghost"}
						className="w-full justify-start p-3 h-auto text-left"
						onClick={() => onChallengeSelect(challenge.id)}
						disabled={challenge.status === "locked"}
					>
						<div className="flex flex-col gap-2 w-full">
							<div className="flex items-center gap-2">
								{getStatusIcon(challenge.status)}
								<span className="font-medium text-sm">{challenge.id}.</span>
							</div>
							<div className="text-xs leading-tight truncate w-full">
								{challenge.title}
							</div>
							<Badge
								variant="secondary"
								className={`${getDifficultyColor(challenge.difficulty)} text-xs h-5 w-fit`}
							>
								{challenge.difficulty}
							</Badge>
						</div>
					</Button>
				))}
			</div>
		</div>
	);
};

export default ChallengeList;
