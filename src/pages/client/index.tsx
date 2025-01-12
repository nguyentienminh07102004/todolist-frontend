import { Navigate, Outlet } from "react-router-dom"

export const Authentication = () => {
	return localStorage.getItem("email") !== null ? <Outlet /> : <Navigate to="/login" />
}