import { Priority, TaskStatus } from "../domain";
import { CategoryResponse } from "../domain/Response";

export const getListPriority = (): { label: string; value: string }[] => {
	return Object.values(Priority).map((value) => ({
		label: value,
		value: value,
	}));
};

export const getListTaskStatus = (): { label: string; value: string }[] => {
	return Object.values(TaskStatus).map((value) => ({
		label: value,
		value: value,
	}));
};

export const getListCategorySelectFromCategoryResponse = (
	value: CategoryResponse[]
): { label: string; value: string }[] => {
	return value.map((category) => ({
		label: category.name,
		value: category.id,
	}));
};
