import { TaskQueryRequest } from "../../domain/Request"

export const TaskQueryAction ={
	UPDATE_QUERY: (value: TaskQueryRequest) => {
		return {
			type: "UPDATE_QUERY",
			payload: value,
		}
	},
	RESET_QUERY: () => {
		return {
			type: "RESET_QUERY",
		}
	}
}