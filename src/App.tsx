import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { TaskListPage } from "./pages/TaskListPage";
import { TaskPage } from "./pages/TaskPage";

export default function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<TaskListPage />} />
				<Route path="/task/:taskId" element={<TaskPage />} />
			</Routes>
		</Router>
	);
}
