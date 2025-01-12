import {
	Button,
	Col,
	Pagination,
	Popconfirm,
	Row,
	Spin,
	Table,
	TableProps,
	Tag,
} from "antd";
import React, { ReactElement } from "react";
import { ImBin2 } from "react-icons/im";
import { IoMdAdd } from "react-icons/io";
import { IoTrashBinOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Location, useLocation, useNavigate } from "react-router-dom";
import { Dispatch } from "redux";
import { UseNotification } from "../../../components/Notification";
import { Page, Priority, TaskStatus } from "../../../domain";
import { TaskQueryRequest } from "../../../domain/Request";
import { APIResponse, TaskResponse } from "../../../domain/Response";
import {
	getColorByPriority,
	getColorByTaskStatus,
} from "../../../helpers/GetColor";
import { getTimeFromISOString } from "../../../helpers/GetTime";
import { TaskQueryAction } from "../../../redux/actions/TaskQueryAction";
import { deleteTask, getTaskList } from "../../../service/TaskService";
import { QueryTask } from "./QueryTask";
import { UpdateTask } from "./UpdateTask";
import { TaskDetail } from "./TaskDetail";
import { UserInfo } from "../user/UserInfo";

export const ListTask: React.FC = (): ReactElement => {
	const dispatch: Dispatch<{ type: string; payload?: TaskQueryRequest }> =
		useDispatch();
	const nav = useNavigate();
	const [reload, setReload] = React.useState<boolean>(false);
	const queryTask: TaskQueryRequest = useSelector(
		(action: any) => action.TaskQueryReducer
	);
	const [fetching, setFetching] = React.useState<boolean>(true);
	const [contextHolder, openNotification] = UseNotification();
	const location: Location<any> = useLocation();
	const [page, setPage] = React.useState<Page>({
		size: 10,
		number: 1,
		totalElements: 0,
		totalPages: 0,
	});
	const [taskSelecteds, setTaskSelecteds] = React.useState<string[]>([]);
	const [listTasks, setListTasks] = React.useState<TaskResponse[]>([]);
	const handleChangePage = (changePage: number) => {
		queryTask.page = changePage;
		dispatch(TaskQueryAction.UPDATE_QUERY(queryTask));
	};
	const handleDeleteTask = async (id: string | string[]) => {
		try {
			await deleteTask(id);
			dispatch(
				TaskQueryAction.UPDATE_QUERY({
					...queryTask,
					page:
						queryTask.page !== undefined && queryTask.page > 1
							? (queryTask.page || 2) - 1
							: 1,
				})
			);
			openNotification({
				type: "success",
				message: "Delete success",
			});
			setReload(!reload);
		} catch (err) {
			openNotification({
				type: "error",
				message: "Delete error",
			});
		}
	};
	React.useEffect(() => {
		if (location.state !== null) {
			openNotification({
				message: location.state?.message,
				type: location.state?.type,
			});
		}
		const loadData = async () => {
			try {
				setFetching(true);
				const res: APIResponse = (await getTaskList(queryTask)).data;
				const listTasks = res.response.content as TaskResponse[];
				for (let task of listTasks) {
					task.key = task.id;
				}
				setListTasks(listTasks);
				setPage({
					...res.response.page,
					number: res.response.page.number + 1,
				});
			} catch (err) {
			} finally {
				setFetching(false);
			}
		};
		loadData();
	}, [queryTask, reload]);
	const rowSelection: TableProps<TaskResponse>["rowSelection"] = {
		onChange: (selectedRowKeys: React.Key[]) => {
			setTaskSelecteds(selectedRowKeys as string[]);
		},
	};
	const columns: TableProps<TaskResponse>["columns"] = [
		{ title: "Task Name", dataIndex: "taskName", key: "taskName" },
		{
			title: "Priority",
			dataIndex: "priority",
			key: "priority",
			render: (value: Priority) => {
				return <Tag color={getColorByPriority(value)}>{value}</Tag>;
			},
		},
		{
			title: "Status",
			dataIndex: "status",
			key: "status",
			render: (value: TaskStatus) => {
				return <Tag color={getColorByTaskStatus(value)}>{value}</Tag>;
			},
		},
		{
			title: "Due Date",
			dataIndex: "dueDate",
			key: "dueDate",
			render: (value: string) => getTimeFromISOString(value),
		},
		{ title: "Category", dataIndex: ["category", "name"], key: "category" },
		{
			title: "Created Date",
			dataIndex: "createdDate",
			key: "createdDate",
			render: (value: string) => getTimeFromISOString(value),
		},
		{
			title: "Action",
			key: "action",
			render: (_, record: TaskResponse) => {
				return (
					<div className="flex justify-evenly">
						<TaskDetail task={record} />
						<UpdateTask
							task={record}
							reload={() => setReload(!reload)}
						/>
						<Popconfirm
							title="Do you sure to delete this task?"
							onConfirm={() => handleDeleteTask(record.id)}
							okText="Yes"
						>
							<Button className="bg-red-400" icon={<ImBin2 />}>
								Delete
							</Button>
						</Popconfirm>
					</div>
				);
			},
		},
	];
	return (
		<div className="mx-auto w-5/6 mt-5">
			{contextHolder}
			<div className="flex justify-between">
				<h1 className="text-4xl mb-4">List Your Task</h1>
				<div className="flex justify-evenly">
					<Button
						type="primary"
						icon={<IoMdAdd />}
						onClick={() => nav("/tasks/create")}
					>
						Create Task
					</Button>
					<Button
						onClick={() => handleDeleteTask(taskSelecteds)}
						className="ms-5 bg-red-500"
					>
						Delete All
					</Button>
					<Button
						icon={<IoTrashBinOutline />}
						className="ms-5 bg-green-500 me-3"
						onClick={() => nav("/tasks/deleted")}
					>
						Deleted
					</Button>
					<UserInfo />
				</div>
			</div>
			<hr />
			<Row gutter={[16, 16]}>
				<Col lg={4} xs={24}>
					<QueryTask />
				</Col>
				<Col lg={20} xs={24}>
					<Spin
						spinning={fetching}
						tip="Loading please wait a minute..."
					>
						<Table<TaskResponse>
							columns={columns}
							dataSource={listTasks}
							pagination={false}
							rowSelection={{
								type: "checkbox",
								...rowSelection,
							}}
						/>
						<Pagination
							align="end"
							current={page.number}
							total={page.totalElements}
							pageSize={page.size}
							showSizeChanger={false}
							onChange={handleChangePage}
						/>
					</Spin>
				</Col>
			</Row>
		</div>
	);
};
