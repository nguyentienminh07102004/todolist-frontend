import {
	Button,
	Col,
	DatePicker,
	Divider,
	Form,
	Input,
	Modal,
	Row,
	Select,
} from "antd";
import "dayjs";
import React from "react";
import { FaRegPenToSquare } from "react-icons/fa6";
import { IoMdAddCircle } from "react-icons/io";
import { UseNotification } from "../../../components/Notification";
import { Priority, TaskStatus } from "../../../domain";
import { TaskRequest } from "../../../domain/Request";
import {
	APIResponse,
	CategoryResponse,
	TaskResponse,
} from "../../../domain/Response";
import { getListPriority, getListTaskStatus } from "../../../helpers/GetData";
import {
	getCategoryByName,
	saveCategory,
} from "../../../service/CategoryService";
import { updateTaskService } from "../../../service/TaskService";
import dayjs, { Dayjs } from "dayjs";
interface IProps {
	task: TaskResponse;
	reload: () => void;
}
export const UpdateTask: React.FC<IProps> = (
	props: IProps
): React.ReactElement => {
	const PriorityOptions = getListPriority();
	const TaskStatusOptions = getListTaskStatus();
	const [open, setOpen] = React.useState<boolean>(false);
	const [listCategory, setListCategory] = React.useState<
		{ label: string; value: string }[]
	>([]);
	const handleSaveCategory = async () => {
		if (newCategoryName !== null) {
			await saveCategory({ name: newCategoryName });
			setNewCategoryName("");
		}
	};
	interface TaskDTO {
		id?: string | undefined;
		taskName: string;
		priority: Priority | null;
		status: TaskStatus | null;
		dueDate: Dayjs | undefined;
		category: string | null;
		description: string | null;
		notes: string | null;
	}
	const taskDTO: TaskDTO = {
		id: props.task.id,
		taskName: props.task.taskName,
		category: props.task?.category?.id,
		priority: props.task.priority,
		status: props.task.status,
		dueDate: props.task.dueDate ? dayjs(props.task?.dueDate) : undefined,
		description: props.task.description,
		notes: props.task.notes,
	};
	const [contextHolder, openNotification] = UseNotification();
	const [newCategoryName, setNewCategoryName] = React.useState<string>("");
	React.useEffect(() => {
		const loadData = async () => {
			const res: APIResponse = (await getCategoryByName(newCategoryName))
				.data;
			const listCategory: CategoryResponse[] = res.response;
			setListCategory(
				listCategory.map((category) => ({
					label: category.name,
					value: category.id,
				}))
			);
		};
		loadData();
	}, [newCategoryName]);
	const updateTask = async (value: TaskDTO) => {
		try {
			if (value.taskName === null || value.taskName.length === 0) {
				openNotification({
					type: "error",
					message: "Task Name is not null or blank",
				});
			}
			const taskRequest: TaskRequest = {
				id: props.task.id,
				taskName: value.taskName,
				priority: value.priority,
				status: value.status,
				description: value.description,
				notes: value.notes,
				category: value.category,
				dueDate: value.dueDate?.format("YYYY-MM-DDTHH:mm:ss"),
				createdDate: props.task.createdDate,
				createdBy: props.task.user.email,
			};
			console.log(taskRequest);
			await updateTaskService(taskRequest);
			props.reload();
			openNotification({
				type: "success",
				message: "Update Task Success",
			});
		} catch (err) {
			openNotification({
				message: "Update fail",
				type: "error",
			});
		}
	};
	return (
		<>
			{contextHolder}
			<Button
				className="bg-yellow-400 mx-2"
				icon={<FaRegPenToSquare />}
				onClick={() => setOpen(true)}
			>
				Update
			</Button>
			<Modal
				open={open}
				footer={false}
				onCancel={() => setOpen(false)}
				width={960}
			>
				<div>
					<div className="mx-auto mt-6">
						<h1 className="mb-3 text-3xl">Update Task</h1>
						<Form
							layout="vertical"
							onFinish={updateTask}
							initialValues={taskDTO}
						>
							<Form.Item
								name="taskName"
								label="Task Name"
								rules={[
									{
										required: true,
										message: "Task Name not null or blank!",
									},
								]}
							>
								<Input />
							</Form.Item>
							<Form.Item name="description" label="Description">
								<Input.TextArea />
							</Form.Item>
							<Row gutter={[16, 16]}>
								<Col md={8} xs={24}>
									<Form.Item name="priority" label="Priority">
										<Select options={PriorityOptions} />
									</Form.Item>
								</Col>
								<Col md={8} xs={24}>
									<Form.Item
										name="status"
										label="Task Status"
									>
										<Select options={TaskStatusOptions} />
									</Form.Item>
								</Col>
								<Col md={8} xs={24}>
									<Form.Item name="category" label="Category">
										<Select
											options={listCategory}
											dropdownRender={(menu) => (
												<>
													{menu}
													<Divider />
													<div className="flex justify-between">
														<Input
															className="me-2"
															value={
																newCategoryName ||
																""
															}
															onChange={(
																e: React.ChangeEvent<HTMLInputElement>
															) => {
																setNewCategoryName(
																	e.target
																		.value
																);
															}}
														/>
														<Button
															icon={
																<IoMdAddCircle />
															}
															onClick={
																handleSaveCategory
															}
														></Button>
													</div>
												</>
											)}
										/>
									</Form.Item>
								</Col>
							</Row>
							<Form.Item name="dueDate" label="Due Date">
								<DatePicker className="w-full" showTime />
							</Form.Item>
							<Form.Item name="notes" label="Notes">
								<Input.TextArea />
							</Form.Item>
							<div className="flex justify-evenly">
								<Button
									className="bg-blue-500"
									onClick={() => setOpen(false)}
								>
									Cancel
								</Button>
								<Button
									htmlType="submit"
									className="bg-blue-500"
								>
									Update
								</Button>
								<Button
									className="bg-blue-500"
									htmlType="reset"
								>
									Reset
								</Button>
							</div>
						</Form>
					</div>
				</div>
			</Modal>
		</>
	);
};
