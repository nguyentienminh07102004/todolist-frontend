import { useMutation } from "@tanstack/react-query";
import { Button, Col, Form, Image, Input, Row } from "antd";
import React from "react";
import { registerUser } from "../../service/register";
import { UserRegisterRequest } from "../../domain/Request";

export const RegisterPage: React.FC = (): JSX.Element => {
	const [loading, setLoading] = React.useState<boolean>(false);
	const mutation = useMutation({
		mutationKey: ["register"],
		mutationFn: registerUser,
		onSuccess(data) {
			console.log(data);
		},
	});
	const register = (value: UserRegisterRequest) => {
		setLoading(true);
		mutation.mutate(value);
	};
	return (
		<div className="mx-4">
			<Row
				gutter={[16, 4]}
				align="middle"
				justify="space-evenly"
				className="h-screen"
			>
				<Col lg={12} xs={24} className="justify-center flex">
					<Image src="/anh_nen_login.png" />
				</Col>
				<Col lg={12} xs={24}>
					<Form
						labelWrap
						labelCol={{ lg: 5, xs: 24 }}
						wrapperCol={{ lg: 19, xs: 24 }}
						onFinish={register}
					>
						<Form.Item
							name="email"
							label="Email"
							rules={[
								{
									required: true,
									message: "Email is not null",
								},
							]}
						>
							<Input type="email" />
						</Form.Item>
						<Form.Item name="fullName" label="Tên đầy đủ">
							<Input />
						</Form.Item>
						<Form.Item name="phone" label="Số điện thoại">
							<Input />
						</Form.Item>
						<Form.Item
							name="password"
							label="Mật khẩu"
							rules={[
								{
									required: true,
									message: "Email is not null",
								},
								{
									min: 8,
									message: "Password must least 8 characters",
								},
							]}
						>
							<Input.Password />
						</Form.Item>
						<Form.Item
							name="rePassword"
							label="Nhập lại mật khẩu"
							rules={[
								{
									required: true,
									message: "Email is not null",
								},
								{
									min: 8,
									message: "Password must least 8 characters",
								},
							]}
						>
							<Input.Password />
						</Form.Item>
						<div className="flex justify-center">
							<Button htmlType="submit" className="bg-blue-600" loading={loading}>
								Đăng ký
							</Button>
						</div>
					</Form>
				</Col>
			</Row>
		</div>
	);
};
