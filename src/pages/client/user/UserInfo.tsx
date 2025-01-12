import { Button, Form, Image, Input, Modal } from "antd";
import React from "react";
import { UseNotification } from "../../../components/Notification";
import {
	UserChangePasswordRequest,
	UserUpdateRequest,
} from "../../../domain/Request";
import { APIResponse, UserResponse } from "../../../domain/Response";
import {
	changePasswordService,
	getMyInfo,
	logoutService,
	updateUserService,
} from "../../../service/UserService";
import { NavigateFunction, useNavigate } from "react-router-dom";

export const UserInfo: React.FC = (): React.ReactElement => {
	const [open, setOpen] = React.useState<boolean>(false);
	const [openChangePassword, setOpenChangePassword] =
		React.useState<boolean>(false);
	const [myInfo, setMyInfo] = React.useState<UserResponse | undefined>(
		undefined
	);
	React.useEffect(() => {
		const loadData = async () => {
			const res: APIResponse = (await getMyInfo()).data;
			setMyInfo(res.response as UserResponse);
		};
		loadData();
	}, []);
	const logout = async (): Promise<void> => {
		try {
			await logoutService();
			localStorage.removeItem("email");
			nav("/login");
		} catch(err) {

		}
	}
	const [contextHolder, openNotification] = UseNotification();
	const nav: NavigateFunction = useNavigate();
	const updateUser = async (value: UserUpdateRequest): Promise<void> => {
		try {
			await updateUserService(value);
			openNotification({
				message: "Update success",
				type: "success",
			});
		} catch (err) {
			openNotification({
				message: "Update fail",
				type: "error",
			});
		}
	};
	const changePassword = async (
		value: UserChangePasswordRequest
	): Promise<void> => {
		try {
			await changePasswordService(value);
			localStorage.removeItem("email");
			nav("/login", {
				state: { message: "Change password success", type: "success" },
			});
		} catch (error) {
			openNotification({
				message: "Change password fail",
				type: "success",
			});
		}
	};
	return (
		<>
			{contextHolder}
			<Image
				src="/user_avatar_default.png"
				preview={false}
				width={80}
				className="cursor-pointer"
				style={{ borderRadius: "50%" }}
				onClick={() => setOpen(true)}
			/>
			<Modal
				open={open}
				onCancel={() => setOpen(false)}
				title="Your Information"
				footer={false}
			>
				<Form
					layout="vertical"
					initialValues={myInfo}
					onFinish={updateUser}
				>
					<Form.Item name="email" label="Email">
						<Input readOnly />
					</Form.Item>
					<Form.Item name="phone" label="Phone">
						<Input />
					</Form.Item>
					<Form.Item name="fullName" label="Full Name">
						<Input />
					</Form.Item>
					<div className="flex justify-between">
						<Button className="bg-blue-300" htmlType="submit">
							Update
						</Button>
						<Button
							onClick={() => setOpenChangePassword(true)}
							className="bg-blue-300"
						>
							Change password
						</Button>
						<Button className="bg-green-300" onClick={logout}>
							Logout
						</Button>
					</div>
				</Form>
			</Modal>
			<Modal
				open={openChangePassword}
				onCancel={() => setOpenChangePassword(false)}
				footer={false}
			>
				<Form layout="vertical" onFinish={changePassword}>
					<Form.Item
						name="oldPassword"
						label="Old Password"
						rules={[{ min: 8, message: "Min is 8!" }]}
					>
						<Input.Password />
					</Form.Item>
					<Form.Item
						name="newPassword"
						label="New Password"
						rules={[{ min: 8, message: "Min is 8!" }]}
					>
						<Input.Password />
					</Form.Item>
					<Form.Item
						name="reNewPassword"
						label="Repeat New Password"
						rules={[{ min: 8, message: "Min is 8!" }]}
					>
						<Input.Password />
					</Form.Item>
					<div className="flex justify-center">
						<Button className="bg-blue-500" htmlType="submit">
							Change password
						</Button>
					</div>
				</Form>
			</Modal>
		</>
	);
};
