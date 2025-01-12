export interface Page {
	size: number;
	number: number;
	totalElements: number;
	totalPages: number;
}

export enum Priority {
	LOW = "LOW",
	MEDIUM = "MEDIUM",
	HIGH = "HIGH"
}

export enum TaskStatus {
	NOT_STARTED = "NOT_STARTED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
}