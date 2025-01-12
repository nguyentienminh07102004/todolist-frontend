import { AxiosResponse } from "axios";
import { api } from "../api";
import { APIResponse } from "../domain/Response";
import { UserChangePasswordRequest, UserForgotPasswordRequest, UserUpdateRequest } from "../domain/Request";

export const getMyInfo = async (): Promise<AxiosResponse<APIResponse, any>> => {
	return await api.get("/auth/users/my-info");
}

export const updateUserService = async (value: UserUpdateRequest): Promise<AxiosResponse<APIResponse, any>> => {
	return await api.put("/auth/users/", value);
}

export const changePasswordService = async (value: UserChangePasswordRequest): Promise<AxiosResponse<APIResponse, any>> => {
	return await api.put("/auth/users/change-password", value);
}

export const logoutService = async (): Promise<AxiosResponse<void, any>> => {
	return await api.post("/users/logout");
}

export const sendPasswordForgotPasswordService = async (value: string): Promise<AxiosResponse<any, any>> => {
	return await api.put(`/users/forgot-password/${value}`);
}

export const verifyCodeAndSendPassword = async (value: UserForgotPasswordRequest): Promise<AxiosResponse<any, any>> => {
	return await api.put("/users/verify-code-set-password", value);
}