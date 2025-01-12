import { Button, DatePicker, Form, Input, Select, SelectProps } from "antd";
import { Dayjs } from "dayjs";
import React from "react";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { TaskQueryRequest } from "../../../domain/Request";
import { APIResponse, CategoryResponse } from "../../../domain/Response";
import { getListPriority, getListTaskStatus } from "../../../helpers/GetData";
import { TaskQueryAction } from "../../../redux/actions/TaskQueryAction";
import { getCategoryByName } from "../../../service/CategoryService";

export const QueryTask: React.FC = (): React.ReactElement => {
	const [category, setCategory] = React.useState([]);
	const dispatch: Dispatch<{ type: string; payload?: TaskQueryRequest }> =
		useDispatch();
	const [categoryName, setCategoryName] = React.useState<string>("");
	React.useEffect(() => {
		const loadData = async () => {
			const res: APIResponse = (await getCategoryByName(categoryName))
				.data;
			setCategory(
				res.response.map((category: CategoryResponse) => ({
					label: category.name,
					value: category.id,
				}))
			);
		};
		loadData();
	}, [categoryName]);
	const optionsStatus: SelectProps["options"] = getListTaskStatus();
	const optionsPriority: SelectProps["options"] = getListPriority();
	const queryTask = (value: {
		taskName?: string;
		priority?: string;
		status?: string;
		dueDateFrom?: Dayjs;
		dueDateTo?: Dayjs;
		categories?: string[];
	}) => {
		const queryTask: TaskQueryRequest = {
			taskName: value.taskName,
			priority: value.priority,
			status: value.status,
			page: 1,
		};
		if (value.dueDateFrom !== undefined) {
			queryTask.dueDateFrom = value.dueDateFrom.format(
				"YYYY-MM-DDTHH:mm:ss"
			);
		}
		if (value.dueDateTo !== undefined) {
			queryTask.dueDateTo = value.dueDateTo.format("YYYY-MM-DDTHH:mm:ss");
		}
		if (value.categories !== undefined && value.categories?.length > 0) {
			queryTask.categories = value.categories.join(", ");
		}
		dispatch(TaskQueryAction.UPDATE_QUERY(queryTask));
	};
	return (
		<>
			<Form layout="vertical" onFinish={queryTask}>
				<Form.Item name="taskName" label="Task Name">
					<Input />
				</Form.Item>
				<Form.Item name="dueDateFrom" label="Due Date From">
					<DatePicker showTime className="w-full" />
				</Form.Item>
				<Form.Item name="dueDateTo" label="Due Date To">
					<DatePicker showTime className="w-full" />
				</Form.Item>
				<Form.Item name="status" label="Status">
					<Select allowClear options={optionsStatus} />
				</Form.Item>
				<Form.Item name="priority" label="Priority">
					<Select allowClear options={optionsPriority} />
				</Form.Item>
				<Form.Item name="categories" label="Category">
					<Select
						allowClear
						mode="multiple"
						options={category}
						filterOption={false}
						onSearch={setCategoryName}
					/>
				</Form.Item>
				<div className="flex justify-evenly">
					<Button type="primary" htmlType="submit">
						Search
					</Button>
					<Button
						htmlType="reset"
						type="primary"
						onClick={(): { type: string; payload?: any } =>
							dispatch(TaskQueryAction.RESET_QUERY())
						}
					>
						Reset
					</Button>
				</div>
			</Form>
		</>
	);
};
