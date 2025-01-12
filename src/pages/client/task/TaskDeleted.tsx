import {
	Button,
	Col,
	Divider,
	List,
	Pagination,
	Popconfirm,
	Row,
	Tag,
} from "antd";
import React from "react";
import { IoCaretBackOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { UseNotification } from "../../../components/Notification";
import { Page } from "../../../domain";
import { APIResponse, TaskResponse } from "../../../domain/Response";
import {
	getColorByPriority,
	getColorByTaskStatus,
} from "../../../helpers/GetColor";
import { getTimeFromISOString } from "../../../helpers/GetTime";
import {
	deletedCompleted,
	getTaskDeleted,
	restoreTaskDeleted,
} from "../../../service/TaskService";

export const TaskDeleted = (): React.ReactElement => {
	const [fetching, setFetching] = React.useState<boolean>(true);
	const [taskDeletedList, setTaskDeletedList] = React.useState<
		TaskResponse[]
	>([]);
	const [page, setPage] = React.useState<Page>({
		totalPages: 0,
		totalElements: 0,
		size: 10,
		number: 1,
	});
	const handleChangePage = (changePage: number) => {
		setPage({ ...page, number: changePage });
	};
	const [reload, setReload] = React.useState<boolean>(false);
	const handleDeletedCompleted = async (id: string) => {
		try {
			await deletedCompleted(id);
			openNotification({
				message: "Delete Completed!",
				type: "success",
			});
			setReload(!reload);
		} catch (err) {
			openNotification({
				message: "Deleted Fail",
				type: "error",
			});
		}
	};

	React.useEffect(() => {
		const loadData = async () => {
			try {
				setFetching(true);
				const res: APIResponse = (
					await getTaskDeleted(page.number, page.size)
				).data;
				setTaskDeletedList(res.response.content as TaskResponse[]);
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
	}, [reload, page.number]);
	const restoreTask = async (id: string) => {
		try {
			await restoreTaskDeleted(id);
			setReload(!reload);
			openNotification({
				message: "Restore success",
				type: "success",
			});
		} catch (err) {
			openNotification({
				message: "Restore fail",
				type: "error",
			});
		}
	};
	const nav = useNavigate();
	const [contextHolder, openNotification] = UseNotification();
	return (
		<>
			{contextHolder}
			<div className="w-3/4 mx-auto mt-10">
				<div className="flex">
					<Button
						icon={<IoCaretBackOutline />}
						onClick={() => nav(-1)}
					></Button>
					<h1 className="text-3xl ms-5">
						Task Deleted{" "}
						<Tag>{page.totalElements} tasks deleted</Tag>
					</h1>
				</div>
				<Divider />
				<List
					dataSource={taskDeletedList}
					loading={fetching}
					renderItem={(item: TaskResponse, index: number) => (
						<List.Item>
							<Row
								align="middle"
								justify="center"
								gutter={[16, 16]}
								className="w-full"
							>
								<Col lg={1}>
									<div>{index + 1}</div>
								</Col>
								<Col lg={5}>
									<div className="text-lg">
										{item.taskName}
									</div>
								</Col>
								<Col lg={8}>
									<div>
										<Tag
											color={getColorByPriority(
												item.priority
											)}
										>
											{item.priority}
										</Tag>
										<Tag
											color={getColorByTaskStatus(
												item.status
											)}
										>
											{item.status}
										</Tag>
									</div>
								</Col>
								<Col lg={8}>
									<div className="flex flex-col">
										<div>
											Deleted Date:{" "}
											{getTimeFromISOString(
												item.modifiedDate
											)}
										</div>
										<hr className="my-3" />
										<div>
											Deleted Date(Completed):{" "}
											{getTimeFromISOString(
												new Date(
													Date.now() +
														(item.timeToLive || 0) *
															1000
												).toISOString()
											)}
										</div>
									</div>
								</Col>
								<Col lg={2} className="flex">
									<Button
										type="link"
										onClick={() => restoreTask(item.id)}
									>
										Restore
									</Button>
									<Popconfirm
										title="Do you want to deleted completed?"
										onConfirm={() =>
											handleDeletedCompleted(item.id)
										}
									>
										<Button type="link">
											Delete (Completed)
										</Button>
									</Popconfirm>
								</Col>
							</Row>
						</List.Item>
					)}
				></List>
				<Pagination
					align="end"
					pageSize={page.size}
					current={page.number}
					total={page.totalElements}
					showSizeChanger={false}
					onChange={handleChangePage}
				/>
			</div>
		</>
	);
};
