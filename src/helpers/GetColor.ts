import { Priority, TaskStatus } from "../domain";

export const getColorByPriority = (value: Priority | undefined): string => {
	if(value === undefined) return "";
	let color: string = "green";
	if (value === Priority.MEDIUM) {
		color = "yellow";
	} else if (value === Priority.HIGH) {
		color = "red";
	}
	return color;
};

export const getColorByTaskStatus = (value: TaskStatus | undefined) => {
	if(value === undefined) return "";
	let color: string = "blue";
	if (value === TaskStatus.IN_PROGRESS) {
		color = "orange";
	} else if (value === TaskStatus.COMPLETED) {
		color = "green";
	} else if (value === TaskStatus.FAILED) {
		color = "red";
	}
	return color;
};
