import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { jwtDecode } from "jwt-decode";

const RequireAuth = () => {
    const { auth } = useAuth();
    const location = useLocation();

    const decoded = auth?.accessToken
        ? jwtDecode(auth.accessToken)
        : undefined;
    

    return (
        decoded
            ? <Outlet />
            : <Navigate to="/login" state={{ from: location }} replace />
    );
}

export default RequireAuth;