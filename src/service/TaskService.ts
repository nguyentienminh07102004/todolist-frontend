import { TaskQueryRequest, TaskRequest } from "../domain/Request";
import { api } from "../api";
import { AxiosResponse } from "axios";

export const getTaskList = async (
	query: TaskQueryRequest
): Promise<AxiosResponse<any, any>> => {
	return await api.get("/auth/tasks/my-task/", {
		params: query,
	});
};

export const saveTask = async (
	value: TaskRequest
): Promise<AxiosResponse<any, any>> => {
	return await api.post("/auth/tasks/", value);
};

export const updateTaskService = async (
	value: TaskRequest
): Promise<AxiosResponse<any, any>> => {
	return await api.put("/auth/tasks/", value);
};

export const deleteTask = async (
	ids: string[] | string
): Promise<AxiosResponse<any, any>> => {
	return await api.delete(`/auth/tasks/my-tasks/${ids}`);
};

export const getTaskDeleted = async (
	page: number = 1,
	pageSize: number = 10
): Promise<AxiosResponse<any, any>> => {
	return await api.get("/auth/tasks/deleted/all", {
		params: {
			page,
			pageSize,
		},
	});
};

export const restoreTaskDeleted = async (
	id: string | string[]
): Promise<AxiosResponse<any, any>> => {
	return await api.put(`/auth/tasks/restore/${id}`);
};

export const deletedCompleted = async (
	ids: string | string[]
): Promise<AxiosResponse<any, any>> => {
	return await api.delete(`/auth/tasks/deleted/completed/${ids}`);
};
