import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Users, Copy, Check, Link2, LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import type { CollaborationSession, SessionUser } from "@/types/session";

interface SessionManagerProps {
	session: CollaborationSession | null;
	sessionId: string | null;
	user: SessionUser | null;
	isConnected: boolean;
	isLoading: boolean;
	error: string | null;
	selectedChallenge: string;
	pendingSessionId?: string | null;
	onCreateSession: (challengeId: string) => Promise<string | null>;
	onJoinSession: (sessionId: string) => Promise<boolean>;
	onLeaveSession: () => Promise<void>;
	onUpdateUserName: (name: string) => void;
}

export function SessionManager({
	session,
	sessionId,
	user,
	isConnected,
	isLoading,
	error,
	selectedChallenge,
	pendingSessionId,
	onCreateSession,
	onJoinSession,
	onLeaveSession,
	onUpdateUserName,
}: SessionManagerProps) {
	const [joinSessionId, setJoinSessionId] = useState("");
	const [userName, setUserName] = useState(user?.name || "");
	const [copied, setCopied] = useState(false);
	const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

	// Automatically open join dialog when there's a pending session ID
	React.useEffect(() => {
		if (pendingSessionId && !isConnected) {
			setJoinSessionId(pendingSessionId);
			setIsJoinDialogOpen(true);
			// Set the username if it exists
			if (user?.name) {
				setUserName(user.name);
			}
		}
	}, [pendingSessionId, isConnected, user?.name]);

	const handleCreateSession = async () => {
		if (userName && userName !== user?.name) {
			onUpdateUserName(userName);
		}
		const newSessionId = await onCreateSession(selectedChallenge);
		if (newSessionId) {
			setIsCreateDialogOpen(false);
		}
	};

	const handleJoinSession = async () => {
		if (userName && userName !== user?.name) {
			onUpdateUserName(userName);
		}
		const joined = await onJoinSession(joinSessionId);
		if (joined) {
			setIsJoinDialogOpen(false);
			setJoinSessionId("");
		}
	};

	const copySessionLink = () => {
		if (sessionId) {
			const link = `${window.location.origin}?session=${sessionId}`;
			navigator.clipboard.writeText(link);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
	};

	const activeParticipants = session
		? Object.values(session.participants).filter((p) => p.isActive)
		: [];

	if (isConnected && session) {
		return (
			<div className="flex items-center gap-2">
				<Badge variant="outline" className="text-[10px] px-1 py-0 h-5">
					Live
				</Badge>
				<TooltipProvider>
					<div className="flex -space-x-1">
						{activeParticipants.slice(0, 3).map((participant) => {
							const isCurrentUser = participant.id === user?.id;
							return (
								<Tooltip key={participant.id}>
									<TooltipTrigger>
										<Avatar
											className="h-6 w-6 border border-background"
											style={{ borderColor: participant.color }}
										>
											<AvatarFallback
												style={{ backgroundColor: participant.color }}
												className="text-[10px] text-white"
											>
												{(() => {
													const words = participant.name.split(' ');
													if (words.length >= 2) {
														return (words[0][0] + (words[1][0] || '')).toUpperCase();
													} else {
														return participant.name.substring(0, 2).toUpperCase();
													}
												})()}
											</AvatarFallback>
										</Avatar>
									</TooltipTrigger>
									<TooltipContent>
										<p className="text-xs">{participant.name} {isCurrentUser && "(You)"}</p>
									</TooltipContent>
								</Tooltip>
							);
						})}
					</div>
				</TooltipProvider>
				{activeParticipants.length > 3 && (
					<span className="text-xs text-muted-foreground">
						+{activeParticipants.length - 3}
					</span>
				)}
				<span className="text-xs text-muted-foreground font-mono">
					#{sessionId?.slice(-6)}
				</span>
				<Button
					variant="ghost"
					size="sm"
					onClick={copySessionLink}
					className="h-6 px-2"
				>
					{copied ? (
						<Check className="h-3 w-3" />
					) : (
						<Link2 className="h-3 w-3" />
					)}
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onClick={onLeaveSession}
					className="h-6 px-2"
				>
					<LogOut className="h-3 w-3" />
				</Button>
			</div>
		);
	}

	return (
		<div className="flex items-center gap-2">
			<span className="text-xs text-muted-foreground">Start Collaborating:</span>
			<Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
				<DialogTrigger asChild>
					<Button variant="default" size="sm" className="h-7 px-3">
						<Users className="h-3 w-3 mr-1" />
						Create Session
					</Button>
				</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Create Collaboration Session</DialogTitle>
							</DialogHeader>
							<div className="space-y-4 pt-4">
								<div className="space-y-2">
									<Label htmlFor="userName">Your Name</Label>
									<Input
										id="userName"
										placeholder="Enter your name"
										value={userName}
										onChange={(e) => setUserName(e.target.value)}
									/>
								</div>
								{error && (
									<p className="text-sm text-destructive">{error}</p>
								)}
								<Button
									onClick={handleCreateSession}
									disabled={isLoading || !userName}
									className="w-full"
								>
									{isLoading ? "Creating..." : "Create Session"}
								</Button>
							</div>
						</DialogContent>
			</Dialog>

			<Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
				<DialogTrigger asChild>
					<Button variant="outline" size="sm" className="h-7 px-3">
						<Link2 className="h-3 w-3 mr-1" />
						Join Session
					</Button>
				</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Join Collaboration Session</DialogTitle>
							</DialogHeader>
							<div className="space-y-4 pt-4">
								<div className="space-y-2">
									<Label htmlFor="userNameJoin">Your Name</Label>
									<Input
										id="userNameJoin"
										placeholder="Enter your name"
										value={userName}
										onChange={(e) => setUserName(e.target.value)}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="sessionId">Session ID or Link</Label>
									<Input
										id="sessionId"
										placeholder="Enter session ID or paste link"
										value={joinSessionId}
										onChange={(e) => {
											const value = e.target.value;
											const sessionMatch = value.match(/session=([^&]+)/);
											if (sessionMatch) {
												setJoinSessionId(sessionMatch[1]);
											} else {
												setJoinSessionId(value);
											}
										}}
									/>
								</div>
								{error && (
									<p className="text-sm text-destructive">{error}</p>
								)}
								<Button
									onClick={handleJoinSession}
									disabled={isLoading || !joinSessionId || !userName}
									className="w-full"
								>
									{isLoading ? "Joining..." : "Join Session"}
								</Button>
							</div>
						</DialogContent>
			</Dialog>
		</div>
	);
}