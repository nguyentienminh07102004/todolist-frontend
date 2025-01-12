import axios, { AxiosInstance } from "axios";

export const api: AxiosInstance = axios.create({
	baseURL: "http://todolist-backend-production-c148.up.railway.app/api",
	headers: {
		"Content-Type": "application/json",
	},
	withCredentials: true,
});
