import { Priority, TaskStatus } from "..";

export interface RoleResponse {
	code: string;
	name: string;
	description?: string;
}

export interface UserResponse {
	email: string;
	fullName?: string;
	phone?: string;
	roles: RoleResponse[];
	status: string;
}

export interface APIResponse {
	code?: number;
	message: string;
	response: any;
}

export interface JwtToken {
	sub: string;
	exp: number;
	jti: string;
	scope: string;
}

export interface CategoryResponse {
	id: string;
	name: string;
}

export interface TaskResponse {
	key?: string;
	id: string;
	taskName: string;
	description: string;
	priority: Priority;
	status: TaskStatus;
	dueDate: string;
	notes: string;
	timeToLive?: number;
	user: UserResponse;
	category: CategoryResponse;
	createdDate: string;
	modifiedDate: string;
}
