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
			<Card className="mb-2">
				<CardHeader className="py-2 px-3">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-1.5">
							<Users className="h-3.5 w-3.5" />
							<CardTitle className="text-xs">Session</CardTitle>
							<Badge variant="outline" className="text-[10px] px-1 py-0 h-4">
								Live
							</Badge>
						</div>
						<div className="flex items-center gap-1">
							<Button
								variant="ghost"
								size="sm"
								onClick={copySessionLink}
								className="h-6 px-2 text-xs"
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
					</div>
				</CardHeader>
				<CardContent className="py-2 px-3 pt-0">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-1.5">
							<TooltipProvider>
								<div className="flex -space-x-1">
									{activeParticipants.map((participant) => {
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
							<span className="text-[10px] text-muted-foreground">
								{user?.name} +{activeParticipants.length - 1}
							</span>
						</div>
						{sessionId && (
							<span className="text-[10px] text-muted-foreground font-mono">
								{sessionId.slice(-6)}
							</span>
						)}
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="mb-2">
			<CardHeader className="py-2 px-3">
				<CardTitle className="text-xs">Start Collaborating</CardTitle>
			</CardHeader>
			<CardContent className="py-2 px-3 pt-0">
				<div className="flex gap-2">
					<Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
						<DialogTrigger asChild>
							<Button variant="default" size="sm" className="flex-1">
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
							<Button variant="outline" size="sm" className="flex-1">
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
			</CardContent>
		</Card>
	);
}