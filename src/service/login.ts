import { AxiosResponse } from "axios";
import { api } from "../api";
import { APIResponse } from "../domain/Response";

export interface LoginRequest {
	email: string;
	password: string;
}


export const LoginUser = async (
	data: LoginRequest
): Promise<AxiosResponse<APIResponse, unknown>> => {
	return await api.post("/users/login", data);
};

export const loginWithGoogle = (): void => {
	const clientId: string = import.meta.env.VITE_clientId;
	const redirect_uri: string = "https://todolist-frontend-iota.vercel.app/?social=google";
	const scope: string =
		"https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile";
	const url = `https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=${redirect_uri}
					&client_id=${clientId}
					&scope=${scope}
					&response_type=code`;
	window.location.href = url;
};
