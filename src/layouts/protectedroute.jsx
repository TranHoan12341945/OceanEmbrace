import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const isAuthenticated = Boolean(localStorage.getItem("token")); // Kiểm tra token trong localStorage hoặc cách xác thực của bạn

  if (!isAuthenticated) {
    return <Navigate to="/auth/sign-in" replace />; // Điều hướng đến trang đăng nhập nếu không có token
  }

  return children;
}

export default ProtectedRoute;
