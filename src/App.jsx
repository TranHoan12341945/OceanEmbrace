import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import ProtectedRoute from "./layouts/ProtectedRoute";
 // Import ProtectedRoute từ layouts
import Home from "@/pages/dashboard/Home"; // Import Home

function App() {
  return (
    <Routes>
      {/* Đặt Home trong ProtectedRoute để yêu cầu người dùng phải đăng nhập */}
      {/* <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      /> */}

      {/* Bảo vệ các route trong dashboard */}
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route path="/auth/*" element={<Auth />} />
      <Route path="*" element={<Navigate to="/auth/sign-in" replace />} /> {/* Điều hướng đến trang đăng nhập nếu chưa đăng nhập */}
    </Routes>
  );
}

export default App;
