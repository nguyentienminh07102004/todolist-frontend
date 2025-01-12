import { AxiosResponse } from "axios";
import { api } from "../api";
import { CategoryRequest } from "../domain/Request";

export const saveCategory = async (
	value: CategoryRequest
): Promise<AxiosResponse<any, any>> => {
	return api.post("/auth/categories/", value);
};

export const getCategoryByName = async (
	value?: string
): Promise<AxiosResponse<any, any>> => {
	return api.get("/auth/categories/name", {
		params: { name: value },
	});
};
