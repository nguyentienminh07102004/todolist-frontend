import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Col, Form, Image, Input, Modal, Row } from "antd";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { useLocation, useNavigate } from "react-router-dom";
import { UseNotification } from "../../components/Notification";
import { APIResponse, JwtToken } from "../../domain/Response";
import { LoginRequest, LoginUser, loginWithGoogle } from "../../service/login";
import { sendPasswordForgotPasswordService, verifyCodeAndSendPassword } from "../../service/UserService";
import { UserForgotPasswordRequest } from "../../domain/Request";

export const LoginPage: React.FC = (): React.ReactElement => {
	const nav = useNavigate();
	const [fetching, setFetching] = React.useState<boolean>(false);
	const [openChangePassword, setOpenChangePassword] =
		React.useState<boolean>(false);
	const [openForgotPassword, setOpenForgotPassword] =
		React.useState<boolean>(false);
	const [contextHolder, openNotification] = UseNotification();
	const login = async (value: LoginRequest) => {
		try {
			setFetching(true);
			const res: APIResponse = (await LoginUser(value)).data;
			const jwt: JwtToken = jwtDecode(res.response.token);
			localStorage.setItem("email", jwt.sub);
			nav("/tasks", {
				state: { message: "Login Success", type: "success" },
			});
		} catch (err) {
		} finally {
			setFetching(false);
		}
	};
	const handleForgotPassword = async (value: { email: string }) => {
		try {
			setOpenChangePassword(true);
			setOpenForgotPassword(false);
			await sendPasswordForgotPasswordService(value.email);
		} catch (err) {
		} finally {
		}
	};
	const location = useLocation();
	React.useEffect(() => {
		if (location.state !== null) {
			openNotification(location.state);
		}
	}, []);
	window.addEventListener("load", async () => {
		const params = new URLSearchParams(window.location.search);
		if (params.get("social") === "google") {
			try {
				setFetching(true);
				const res: APIResponse = (
					await axios.post(
						"https://todolist-backend-production-c148.up.railway.app/api/users/login/google",
						{ code: params.get("code") },
						{
							withCredentials: true,
						}
					)
				).data;
				const jwt: JwtToken = jwtDecode(res.response.token);
				localStorage.setItem("email", jwt.sub);
				nav("/tasks");
			} catch (err) {
				console.log(err);
			} finally {
				setFetching(false);
			}
		}
	});
	const changePassword = async (value: UserForgotPasswordRequest) => {
		try {
			await verifyCodeAndSendPassword(value);
			openNotification({
				message: "Change password success",
				type: "success"
			});
			setOpenChangePassword(false);
			localStorage.removeItem("email");
		} catch (error) {
			setOpenForgotPassword(true);
			openNotification({
				message: "Please again!",
				type: "error"
			});
		}
	};
	return (
		<>
			{contextHolder}
			<Row gutter={[50, 16]} className="px-6 h-screen" align="middle">
				<Col lg={12} xs={24} className="justify-center flex">
					<Image src="/anh_nen_login.png" />
				</Col>
				<Col lg={12} xs={24} className="justify-center flex">
					<Form layout="vertical" className="w-2/3" onFinish={login}>
						<Form.Item
							name="email"
							label="Email"
							rules={[
								{
									required: true,
									message: "Email is not null ",
								},
							]}
						>
							<Input prefix={<UserOutlined />} type="email" />
						</Form.Item>
						<Form.Item
							name="password"
							label="Mật khẩu"
							rules={[
								{
									required: true,
									message: "Mật khẩu không thể trống",
								},
								{
									min: 8,
									message: "Mật khẩu có it nhất 8 ký tự",
								},
							]}
						>
							<Input.Password prefix={<LockOutlined />} />
						</Form.Item>
						<div className="flex justify-end">
							<Button
								type="link"
								onClick={() => setOpenForgotPassword(true)}
							>
								Quên mật khẩu?
							</Button>
						</div>
						<Button
							loading={fetching}
							className="w-full rounded-lg mt-3 bg-blue-400"
							htmlType="submit"
						>
							Đăng nhập
						</Button>
						<Button
							loading={fetching}
							className="bg-red-400 w-full rounded-lg mt-3"
							icon={<FcGoogle />}
							onClick={loginWithGoogle}
						>
							Đăng nhập với Google
						</Button>
					</Form>
				</Col>
			</Row>
			<Modal
				title="Enter your email!! My code will send to your email !!"
				open={openForgotPassword}
				footer={false}
				onCancel={() => setOpenForgotPassword(false)}
			>
				<Form onFinish={handleForgotPassword}>
					<Form.Item name="email" label="Email">
						<Input type="email" />
					</Form.Item>
					<div className="flex justify-center">
						<Button htmlType="submit" className="bg-blue-200">
							Submit
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
					<Form.Item name="code" label="Verify Code">
						<Input.OTP />
					</Form.Item>
					<Form.Item
						name="password"
						label="Password"
						rules={[{ min: 8, message: "Min is 8!" }]}
					>
						<Input.Password />
					</Form.Item>
					<Form.Item
						name="rePassword"
						label="Repeat Password"
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
