export interface CollaborationSession {
	id: string;
	createdAt: number;
	updatedAt: number;
	participants: Record<string, Participant>;
	editor: EditorState;
	queryResults: QueryResultsState | null;
	selectedChallenge: string;
}

export interface Participant {
	id: string;
	name: string;
	color: string;
	joinedAt: number;
	lastSeen: number;
	isActive: boolean;
}

export interface EditorState {
	content: string;
	cursorPositions?: Record<string, CursorPosition>;
	selections?: Record<string, SelectionRange>;
}

export interface CursorPosition {
	line: number;
	column: number;
}

export interface SelectionRange {
	startLine: number;
	startColumn: number;
	endLine: number;
	endColumn: number;
}

export interface QueryResultsState {
	results: any[];
	executionTime: number;
	error: string | null;
	timestamp: number;
}

export interface SessionUser {
	id: string;
	name: string;
	color: string;
}
