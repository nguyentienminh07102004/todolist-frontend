import { AxiosResponse } from "axios";
import { api } from "../api";
import { UserRegisterRequest } from "../domain/Request";

export const registerUser = async (data: UserRegisterRequest): Promise<AxiosResponse> => {
	return await api.post('/users/register', data);
}
