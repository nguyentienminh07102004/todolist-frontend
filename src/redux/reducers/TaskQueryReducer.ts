import { TaskQueryRequest } from "../../domain/Request";

export const TaskQueryReducer = (
	state: TaskQueryRequest = {},
	action: { type: string; payload?: TaskQueryRequest }
) => {
	if (action.type === "UPDATE_QUERY") {
		return { ...state, ...action.payload };
	} else if (action.type === "RESET_QUERY") {
		return {};
	}
	return state;
};
