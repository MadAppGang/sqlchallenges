export interface Task {
	id: string;
	title: string;
	difficulty: "Easy" | "Medium" | "Hard";
	category: string;
	timeEstimate: string;
	description: string;
	requirements: string[];
	expectedColumns: string[];
	sampleOutput?: string;
	hints?: string[];
	bonusQuestions?: string[];
	validationQuery?: string;
	tables: string[];
	skills: string[];
	isPublic: boolean;
	isFeatured?: boolean;
	createdBy?: string;
	createdAt?: Date;
	updatedAt?: Date;
	dbSchema: string;
	seedData: string;
}
