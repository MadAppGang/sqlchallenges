// Hard-coded task content for now - in production, these would be loaded from a CMS or API
import { task1Content, task2Content, task3Content } from "./taskContent";

export interface TaskMetadata {
	id: number;
	title: string;
	difficulty: "Easy" | "Medium" | "Hard";
	category: string;
	timeEstimate: string;
	tables: string[];
	skills: string[];
}

export interface ParsedTask {
	metadata: TaskMetadata;
	content: string;
	htmlContent?: string;
}

/**
 * Parse YAML frontmatter from markdown content
 */
function parseFrontmatter(content: string): { metadata: any; content: string } {
	const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
	const match = content.match(frontmatterRegex);

	if (!match) {
		return { metadata: {}, content };
	}

	const yamlContent = match[1];
	const markdownContent = match[2];

	// Simple YAML parser for our specific format
	const metadata: any = {};
	const lines = yamlContent.split("\n");
	let currentKey = "";
	let inArray = false;

	for (const line of lines) {
		const trimmed = line.trim();

		if (trimmed.endsWith(":")) {
			// New key with array value coming
			currentKey = trimmed.slice(0, -1);
			inArray = true;
			metadata[currentKey] = [];
		} else if (line.startsWith("  - ") && inArray) {
			// Array item
			metadata[currentKey].push(line.slice(4).trim());
		} else if (trimmed.includes(": ")) {
			// Simple key-value pair
			const [key, ...valueParts] = trimmed.split(": ");
			const value = valueParts.join(": ");
			metadata[key] = value;
			inArray = false;

			// Convert difficulty to proper case
			if (key === "difficulty") {
				metadata[key] = (value.charAt(0).toUpperCase() +
					value.slice(1).toLowerCase()) as "Easy" | "Medium" | "Hard";
			}
			// Convert id to number
			if (key === "id") {
				metadata[key] = parseInt(value, 10);
			}
		}
	}

	return { metadata, content: markdownContent };
}

/**
 * Convert markdown to HTML (basic conversion)
 */
function markdownToHtml(markdown: string): string {
	let html = markdown;

	// Headers
	html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");
	html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>");
	html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>");

	// Bold
	html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

	// Italic
	html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

	// Code blocks
	html = html.replace(
		/```sql\n([\s\S]*?)```/g,
		'<pre><code class="language-sql">$1</code></pre>',
	);
	html = html.replace(/```\n([\s\S]*?)```/g, "<pre><code>$1</code></pre>");

	// Inline code
	html = html.replace(/`(.+?)`/g, "<code>$1</code>");

	// Lists
	html = html.replace(/^\d+\. (.+)$/gim, "<li>$1</li>");
	html = html.replace(/^- (.+)$/gim, "<li>$1</li>");

	// Wrap consecutive list items
	html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`);

	// Paragraphs
	html = html.replace(/\n\n/g, "</p><p>");
	html = `<p>${html}</p>`;

	// Clean up empty paragraphs
	html = html.replace(/<p><\/p>/g, "");
	html = html.replace(/<p>(<h[1-6]>)/g, "$1");
	html = html.replace(/(<\/h[1-6]>)<\/p>/g, "$1");

	return html;
}

/**
 * Parse a task markdown file
 */
export function parseTaskMarkdown(content: string): ParsedTask {
	const { metadata, content: markdownContent } = parseFrontmatter(content);
	const htmlContent = markdownToHtml(markdownContent);

	return {
		metadata: metadata as TaskMetadata,
		content: markdownContent,
		htmlContent,
	};
}

/**
 * Get all tasks
 */
export function getAllTasks(): ParsedTask[] {
	const tasks = [
		parseTaskMarkdown(task1Content),
		parseTaskMarkdown(task2Content),
		parseTaskMarkdown(task3Content),
	];

	return tasks.sort((a, b) => a.metadata.id - b.metadata.id);
}

/**
 * Get a specific task by ID
 */
export function getTaskById(id: number): ParsedTask | undefined {
	const tasks = getAllTasks();
	return tasks.find((task) => task.metadata.id === id);
}

/**
 * Get table schemas for a specific task
 */
export function getTaskTables(taskId: number): string[] {
	const task = getTaskById(taskId);
	return task?.metadata.tables || [];
}
