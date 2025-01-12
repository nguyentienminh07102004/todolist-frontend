import { notification } from "antd";
import { ArgsProps } from "antd/es/notification/interface";
import React from "react";

export const UseNotification = (
): [React.ReactElement, (value: ArgsProps) => void] => {
	const [api, contextHolder] = notification.useNotification();
	const openNotification = (value: ArgsProps) => {
		api[value?.type || "open"]({
			...value,
			duration: value?.duration || 5,
			pauseOnHover: value?.pauseOnHover || false,
			showProgress: value?.showProgress || true,
			placement: value?.placement || "topRight",
		});
	};
	return [contextHolder, openNotification];
};
