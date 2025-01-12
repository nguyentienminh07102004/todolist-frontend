import { Button, Drawer, Tag } from "antd";
import React from "react";
import { TaskResponse } from "../../../domain/Response";
import {
	getColorByPriority,
	getColorByTaskStatus,
} from "../../../helpers/GetColor";
import { getTimeFromISOString } from "../../../helpers/GetTime";
import { ClockCircleOutlined } from "@ant-design/icons";
import { FaRegNoteSticky } from "react-icons/fa6";

interface IProps {
	task: TaskResponse | null;
}
export const TaskDetail: React.FC<IProps> = (
	props: IProps
): React.ReactElement => {
	const [open, setOpen] = React.useState(false);
	return (
		<>
			<Button
				onClick={() => setOpen(true)}
				className="bg-green-500"
				icon={<FaRegNoteSticky />}
			>
				Detail
			</Button>
			<Drawer
				open={open}
				onClose={() => setOpen(false)}
				size="large"
				title={props.task?.taskName}
			>
				<div className="flex justify-self-start">
					<Tag color="blue-inverse">
						Category: {props.task?.category?.name}
					</Tag>
					<Tag color={getColorByPriority(props.task?.priority)}>
						{props.task?.priority}
					</Tag>
					<Tag color={getColorByTaskStatus(props.task?.status)}>
						{props.task?.status}
					</Tag>
				</div>
				<div className="mt-4">
					<span className="me-4">Due Date Time: </span>
					<Tag color="red" icon={<ClockCircleOutlined />}>
						{getTimeFromISOString(props.task?.dueDate)}
					</Tag>
				</div>
				<div className="mt-5">
					<p className="text-3xl">Description: </p>
					<textarea className="w-full border-black border rounded-lg mt-4 h-40">
						{props.task?.description}
					</textarea>
				</div>
				<div className="mt-5">
					<p className="text-3xl">Note: </p>
					<textarea className="w-full border-black border rounded-lg mt-4 h-40">
						{props.task?.notes}
					</textarea>
				</div>
			</Drawer>
		</>
	);
};
