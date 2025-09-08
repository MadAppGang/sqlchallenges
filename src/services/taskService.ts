import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	query,
	updateDoc,
	where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Task } from "@/types/task";

const TASKS_COLLECTION = "tasks";

export const taskService = {
	async getPublicTasks(): Promise<Task[]> {
		try {
			const q = query(
				collection(db, TASKS_COLLECTION),
				where("isPublic", "==", true),
			);
			const snapshot = await getDocs(q);
			const tasks = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			})) as Task[];

			// Sort in memory to avoid index requirement
			return tasks.sort((a, b) => {
				// Handle both Firestore Timestamp and Date objects
				const dateA = a.createdAt
					? typeof a.createdAt === "object" && "seconds" in a.createdAt
						? a.createdAt.seconds
						: new Date(a.createdAt).getTime() / 1000
					: 0;
				const dateB = b.createdAt
					? typeof b.createdAt === "object" && "seconds" in b.createdAt
						? b.createdAt.seconds
						: new Date(b.createdAt).getTime() / 1000
					: 0;
				return dateB - dateA;
			});
		} catch (error) {
			console.error("Error fetching tasks from Firestore:", error);
			return [];
		}
	},

	async getTaskById(taskId: string): Promise<Task | null> {
		try {
			const docRef = doc(db, TASKS_COLLECTION, taskId);
			const docSnap = await getDoc(docRef);
			if (docSnap.exists()) {
				return { id: docSnap.id, ...docSnap.data() } as Task;
			}
			return null;
		} catch (error) {
			console.error("Error fetching task from Firestore:", error);
			return null;
		}
	},

	async getUserTasks(userId: string): Promise<Task[]> {
		const q = query(
			collection(db, TASKS_COLLECTION),
			where("createdBy", "==", userId),
		);
		const snapshot = await getDocs(q);
		const tasks = snapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		})) as Task[];

		// Sort in memory to avoid index requirement
		return tasks.sort((a, b) => {
			const dateA = a.createdAt?.seconds || 0;
			const dateB = b.createdAt?.seconds || 0;
			return dateB - dateA;
		});
	},

	async createTask(task: Omit<Task, "id">): Promise<string> {
		const docRef = await addDoc(collection(db, TASKS_COLLECTION), {
			...task,
			createdAt: new Date(),
			updatedAt: new Date(),
		});
		return docRef.id;
	},

	async updateTask(taskId: string, updates: Partial<Task>): Promise<void> {
		const docRef = doc(db, TASKS_COLLECTION, taskId);
		await updateDoc(docRef, {
			...updates,
			updatedAt: new Date(),
		});
	},

	async deleteTask(taskId: string): Promise<void> {
		const docRef = doc(db, TASKS_COLLECTION, taskId);
		await deleteDoc(docRef);
	},
};
