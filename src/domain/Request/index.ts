import { Priority, TaskStatus } from "..";

export interface TaskQueryRequest {
	taskName?: string;
    priority?: string;
    status?: string;
    dueDateFrom?: string;
    dueDateTo?: string;
    categories?: string;
    page?: number;
    pageSize?: number;
}

export interface UserRegisterRequest {
	email: string;
	fullName: string;
	phone: string;
	password: string;
	rePassword: string;
	roles?: string[];
}

export interface UserUpdateRequest {
	email: string;
	fullName?: string;
	phone?: string;
	roles?: string[];
}

export interface UserChangePasswordRequest {
    oldPassword: string;
    newPassword: string;
    reNewPassword: string;
}

export interface TaskRequest {
    id?: string | undefined;
    taskName: string;
    priority: Priority | null;
    status: TaskStatus | null;
    dueDate: string | undefined;
    category: string | null;
    description: string | null;
    notes: string | null;
    createdDate?: string | null;
    createdBy?: string | null;
}

export interface CategoryRequest {
    id?: string;
    name: string
}

export interface UserForgotPasswordRequest {
    code: string;
    password: string;
    rePassword: string;
}