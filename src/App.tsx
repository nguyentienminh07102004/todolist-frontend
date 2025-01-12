import { Route, Routes } from "react-router-dom";
import { AddTask } from "./pages/client/task/AddTask";
import { ListTask } from "./pages/client/task/ListTask";
import { LoginPage } from "./pages/login";
import { RegisterPage } from "./pages/register";
import { TaskDeleted } from "./pages/client/task/TaskDeleted";
import { Authentication } from "./pages/client";

export default function App() {
	return (
		<>
			<Routes>
				<Route index element={<LoginPage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/register" element={<RegisterPage />} />
				<Route element={<Authentication />}>
					<Route path="/tasks/" element={<ListTask />} />
					<Route path="/tasks/create" element={<AddTask />} />
					<Route path="/tasks/deleted" element={<TaskDeleted />} />
				</Route>
			</Routes>
		</>
	);
}
