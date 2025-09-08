import {
	ref,
	onValue,
	set,
	update,
	push,
	onDisconnect,
	serverTimestamp,
	DataSnapshot,
	off,
} from "firebase/database";
import { realtimeDb } from "@/lib/firebase";
import type {
	CollaborationSession,
	Participant,
	EditorState,
	QueryResultsState,
	SessionUser,
} from "@/types/session";

const SESSIONS_PATH = "sessions";
const PRESENCE_PATH = "presence";

class SessionService {
	private currentSessionId: string | null = null;
	private currentUserId: string | null = null;
	private listeners: Array<() => void> = [];

	generateUserId(): string {
		return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
	}

	generateSessionId(): string {
		return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
	}

	getRandomColor(): string {
		const colors = [
			"#FF6B6B",
			"#4ECDC4",
			"#45B7D1",
			"#96CEB4",
			"#FFEAA7",
			"#DDA0DD",
			"#98D8C8",
			"#FFD700",
			"#FFA07A",
			"#20B2AA",
		];
		return colors[Math.floor(Math.random() * colors.length)];
	}

	async createSession(user: SessionUser, selectedChallenge: string): Promise<string> {
		const sessionId = this.generateSessionId();
		const participant: Participant = {
			id: user.id,
			name: user.name,
			color: user.color,
			joinedAt: Date.now(),
			lastSeen: Date.now(),
			isActive: true,
		};

		const session: CollaborationSession = {
			id: sessionId,
			createdAt: Date.now(),
			updatedAt: Date.now(),
			participants: {
				[user.id]: participant,
			},
			editor: {
				content: "",
			},
			queryResults: null,
			selectedChallenge,
		};

		const sessionRef = ref(realtimeDb, `${SESSIONS_PATH}/${sessionId}`);
		await set(sessionRef, session);

		this.currentSessionId = sessionId;
		this.currentUserId = user.id;
		this.setupPresence(sessionId, user.id);

		return sessionId;
	}

	async joinSession(sessionId: string, user: SessionUser): Promise<boolean> {
		const sessionRef = ref(realtimeDb, `${SESSIONS_PATH}/${sessionId}`);

		try {
			const participant: Participant = {
				id: user.id,
				name: user.name,
				color: user.color,
				joinedAt: Date.now(),
				lastSeen: Date.now(),
				isActive: true,
			};

			await update(sessionRef, {
				[`participants/${user.id}`]: participant,
				updatedAt: Date.now(),
			});

			this.currentSessionId = sessionId;
			this.currentUserId = user.id;
			this.setupPresence(sessionId, user.id);

			return true;
		} catch (error) {
			console.error("Error joining session:", error);
			return false;
		}
	}

	private setupPresence(sessionId: string, userId: string) {
		const userStatusRef = ref(
			realtimeDb,
			`${SESSIONS_PATH}/${sessionId}/participants/${userId}/isActive`,
		);
		const userLastSeenRef = ref(
			realtimeDb,
			`${SESSIONS_PATH}/${sessionId}/participants/${userId}/lastSeen`,
		);

		set(userStatusRef, true);

		onDisconnect(userStatusRef).set(false);
		onDisconnect(userLastSeenRef).set(serverTimestamp());

		const presenceRef = ref(realtimeDb, ".info/connected");
		const unsubscribe = onValue(presenceRef, (snapshot) => {
			if (snapshot.val() === true) {
				set(userStatusRef, true);
				set(userLastSeenRef, serverTimestamp());
			}
		});

		this.listeners.push(() => off(presenceRef, "value", unsubscribe));
	}

	subscribeToSession(
		sessionId: string,
		callback: (session: CollaborationSession | null) => void,
	): () => void {
		const sessionRef = ref(realtimeDb, `${SESSIONS_PATH}/${sessionId}`);

		const unsubscribe = onValue(sessionRef, (snapshot: DataSnapshot) => {
			const data = snapshot.val();
			callback(data);
		});

		const cleanup = () => off(sessionRef, "value", unsubscribe);
		this.listeners.push(cleanup);
		return cleanup;
	}

	async updateEditorContent(sessionId: string, content: string) {
		if (!sessionId) return;

		const editorRef = ref(realtimeDb, `${SESSIONS_PATH}/${sessionId}/editor`);
		const updates: EditorState = {
			content,
		};

		await update(editorRef, updates);
		await this.updateSessionTimestamp(sessionId);
	}

	async updateCursorPosition(
		sessionId: string,
		userId: string,
		line: number,
		column: number,
	) {
		if (!sessionId || !userId) return;

		const cursorRef = ref(
			realtimeDb,
			`${SESSIONS_PATH}/${sessionId}/editor/cursorPositions/${userId}`,
		);
		await set(cursorRef, { line, column });
	}

	async updateSelection(
		sessionId: string,
		userId: string,
		startLine: number,
		startColumn: number,
		endLine: number,
		endColumn: number,
	) {
		if (!sessionId || !userId) return;

		const selectionRef = ref(
			realtimeDb,
			`${SESSIONS_PATH}/${sessionId}/editor/selections/${userId}`,
		);
		
		// If selection is empty (cursor position), remove the selection
		if (startLine === endLine && startColumn === endColumn) {
			await set(selectionRef, null);
		} else {
			await set(selectionRef, { startLine, startColumn, endLine, endColumn });
		}
	}

	async updateQueryResults(sessionId: string, results: QueryResultsState) {
		if (!sessionId) return;

		const resultsRef = ref(realtimeDb, `${SESSIONS_PATH}/${sessionId}/queryResults`);
		await set(resultsRef, results);
		await this.updateSessionTimestamp(sessionId);
	}

	async updateSelectedChallenge(sessionId: string, challengeId: string) {
		if (!sessionId) return;

		const challengeRef = ref(realtimeDb, `${SESSIONS_PATH}/${sessionId}/selectedChallenge`);
		await set(challengeRef, challengeId);
		await this.updateSessionTimestamp(sessionId);
	}

	private async updateSessionTimestamp(sessionId: string) {
		const timestampRef = ref(realtimeDb, `${SESSIONS_PATH}/${sessionId}/updatedAt`);
		await set(timestampRef, Date.now());
	}

	async leaveSession() {
		if (this.currentSessionId && this.currentUserId) {
			const userStatusRef = ref(
				realtimeDb,
				`${SESSIONS_PATH}/${this.currentSessionId}/participants/${this.currentUserId}/isActive`,
			);
			await set(userStatusRef, false);
		}

		this.cleanup();
	}

	cleanup() {
		this.listeners.forEach((cleanup) => cleanup());
		this.listeners = [];
		this.currentSessionId = null;
		this.currentUserId = null;
	}

	getCurrentSessionId(): string | null {
		return this.currentSessionId;
	}

	getCurrentUserId(): string | null {
		return this.currentUserId;
	}
}

export const sessionService = new SessionService();