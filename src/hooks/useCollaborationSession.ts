import { useState, useEffect, useCallback } from "react";
import { sessionService } from "@/services/sessionService";
import type { CollaborationSession, SessionUser, QueryResultsState } from "@/types/session";

export function useCollaborationSession() {
	const [session, setSession] = useState<CollaborationSession | null>(null);
	const [sessionId, setSessionId] = useState<string | null>(null);
	const [user, setUser] = useState<SessionUser | null>(null);
	const [isConnected, setIsConnected] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const storedUser = localStorage.getItem("sessionUser");
		if (storedUser) {
			setUser(JSON.parse(storedUser));
		} else {
			const newUser: SessionUser = {
				id: sessionService.generateUserId(),
				name: `User ${Math.floor(Math.random() * 1000)}`,
				color: sessionService.getRandomColor(),
			};
			localStorage.setItem("sessionUser", JSON.stringify(newUser));
			setUser(newUser);
		}
	}, []);

	const createSession = useCallback(
		async (selectedChallenge: string) => {
			if (!user) return null;

			setIsLoading(true);
			setError(null);

			try {
				const newSessionId = await sessionService.createSession(user, selectedChallenge);
				setSessionId(newSessionId);
				setIsConnected(true);

				const unsubscribe = sessionService.subscribeToSession(newSessionId, (sessionData) => {
					setSession(sessionData);
				});

				return newSessionId;
			} catch (err) {
				setError(err instanceof Error ? err.message : "Failed to create session");
				return null;
			} finally {
				setIsLoading(false);
			}
		},
		[user],
	);

	const joinSession = useCallback(
		async (sessionIdToJoin: string) => {
			if (!user) return false;

			setIsLoading(true);
			setError(null);

			try {
				const joined = await sessionService.joinSession(sessionIdToJoin, user);
				if (joined) {
					setSessionId(sessionIdToJoin);
					setIsConnected(true);

					const unsubscribe = sessionService.subscribeToSession(
						sessionIdToJoin,
						(sessionData) => {
							setSession(sessionData);
						},
					);

					return true;
				}
				return false;
			} catch (err) {
				setError(err instanceof Error ? err.message : "Failed to join session");
				return false;
			} finally {
				setIsLoading(false);
			}
		},
		[user],
	);

	const updateEditorContent = useCallback(
		async (content: string) => {
			if (!sessionId) return;
			await sessionService.updateEditorContent(sessionId, content);
		},
		[sessionId],
	);

	const updateQueryResults = useCallback(
		async (results: QueryResultsState) => {
			if (!sessionId) return;
			await sessionService.updateQueryResults(sessionId, results);
		},
		[sessionId],
	);

	const updateSelectedChallenge = useCallback(
		async (challengeId: string) => {
			if (!sessionId) return;
			await sessionService.updateSelectedChallenge(sessionId, challengeId);
		},
		[sessionId],
	);

	const updateCursorPosition = useCallback(
		async (line: number, column: number) => {
			if (!sessionId || !user) return;
			await sessionService.updateCursorPosition(sessionId, user.id, line, column);
		},
		[sessionId, user],
	);

	const updateSelection = useCallback(
		async (startLine: number, startColumn: number, endLine: number, endColumn: number) => {
			if (!sessionId || !user) return;
			await sessionService.updateSelection(sessionId, user.id, startLine, startColumn, endLine, endColumn);
		},
		[sessionId, user],
	);

	const leaveSession = useCallback(async () => {
		await sessionService.leaveSession();
		setSession(null);
		setSessionId(null);
		setIsConnected(false);
	}, []);

	const updateUserName = useCallback((name: string) => {
		if (!user) return;
		const updatedUser = { ...user, name };
		setUser(updatedUser);
		localStorage.setItem("sessionUser", JSON.stringify(updatedUser));
	}, [user]);

	useEffect(() => {
		return () => {
			sessionService.cleanup();
		};
	}, []);

	return {
		session,
		sessionId,
		user,
		isConnected,
		isLoading,
		error,
		createSession,
		joinSession,
		updateEditorContent,
		updateQueryResults,
		updateSelectedChallenge,
		updateCursorPosition,
		updateSelection,
		leaveSession,
		updateUserName,
	};
}