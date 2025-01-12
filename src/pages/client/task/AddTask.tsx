import {
	Button,
	Col,
	DatePicker,
	Divider,
	Form,
	Input,
	Row,
	Select,
	Spin,
} from "antd";
import { Dayjs } from "dayjs";
import React from "react";
import { useNavigate } from "react-router-dom";
import { UseNotification } from "../../../components/Notification";
import { Priority, TaskStatus } from "../../../domain";
import { TaskRequest } from "../../../domain/Request";
import { APIResponse, CategoryResponse } from "../../../domain/Response";
import {
	getListCategorySelectFromCategoryResponse,
	getListPriority,
	getListTaskStatus,
} from "../../../helpers/GetData";
import {
	getCategoryByName,
	saveCategory,
} from "../../../service/CategoryService";
import { saveTask } from "../../../service/TaskService";
import { IoMdAddCircle } from "react-icons/io";
import { IoCaretBackOutline } from "react-icons/io5";

export const AddTask = (): React.ReactElement => {
	const PriorityOptions = getListPriority();
	const TaskStatusOptions = getListTaskStatus();
	const [listCategory, setListCategory] = React.useState<
		{ label: string; value: string }[]
	>([]);
	const [fetching, setFetching] = React.useState<boolean>(false);
	const [newCategoryName, setNewCategoryName] = React.useState<string>("");
	const handleSaveCategory = async () => {
		if (newCategoryName !== null) {
			await saveCategory({ name: newCategoryName });
			setNewCategoryName("");
		}
	};
	const nav = useNavigate();
	const [form] = Form.useForm();
	const [contextHolder, openNotification] = UseNotification();
	React.useEffect(() => {
		const loadData = async () => {
			const res: APIResponse = (await getCategoryByName(newCategoryName))
				.data;
			const listCategory: CategoryResponse[] = res.response;
			setListCategory(
				getListCategorySelectFromCategoryResponse(listCategory)
			);
		};
		loadData();
	}, [newCategoryName]);
	const addTask = async (value: {
		taskName: string;
		description: string;
		priority: Priority;
		status: TaskStatus;
		category: string;
		dueDate: Dayjs | null;
		notes: string;
	}) => {
		try {
			setFetching(true);
			if (value.taskName === null || value.taskName.length === 0) {
				openNotification({
					type: "error",
					message: "Task Name is not null or blank",
				});
			}
			const task: TaskRequest = {
				taskName: value.taskName,
				priority: value.priority,
				status: value.status,
				description: value.description,
				notes: value.notes,
				category: value.category,
				dueDate: value.dueDate?.locale("vn").format(),
			};
			await saveTask(task);
			openNotification({
				type: "success",
				message: "Create Task Success",
			});
			form.resetFields();
		} catch (err) {
			openNotification({
				message: "Create task fail",
				type: "error",
			});
		} finally {
			setFetching(false);
		}
	};
	return (
		<>
			{contextHolder}
			<div className="mx-auto w-1/2 mt-6">
				<div className="flex">
					<Button
						icon={<IoCaretBackOutline />}
						onClick={() => nav(-1)}
					></Button>
					<h1 className="mb-3 text-3xl ms-5">Create Task</h1>
				</div>
				<Spin spinning={fetching}>
					<Form layout="vertical" onFinish={addTask} form={form}>
						<Form.Item
							name="taskName"
							label="Task Name"
							rules={[
								{
									required: true,
									message: "Task Name is not null or blank!",
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
								<Form.Item name="status" label="Task Status">
									<Select options={TaskStatusOptions} />
								</Form.Item>
							</Col>
							<Col
								md={8}
								xs={24}
								className="flex flex-row items-center justify-between"
							>
								<Form.Item
									name="category"
									label="Category"
									className="flex-1 me-3"
								>
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
																e.target.value
															);
														}}
													/>
													<Button
														icon={<IoMdAddCircle />}
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
							<Button htmlType="submit" className="bg-blue-500">
								Create
							</Button>
							<Button className="bg-blue-500" htmlType="reset">
								Reset
							</Button>
						</div>
					</Form>
				</Spin>
			</div>
		</>
	);
};
