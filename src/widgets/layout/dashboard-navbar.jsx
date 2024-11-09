import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  Navbar,
  Typography,
  Button,
  IconButton,
  Breadcrumbs,
  Input,
  Popover,
  PopoverHandler,
  PopoverContent,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  Cog6ToothIcon,
  BellIcon,
  Bars3Icon,
} from "@heroicons/react/24/solid";
import {
  useMaterialTailwindController,
  setOpenConfigurator,
  setOpenSidenav,
} from "@/context";
import { fetchAccountDetails } from "@/api"; // Import API

export function DashboardNavbar() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { fixedNavbar, openSidenav } = controller;
  const { pathname } = useLocation();
  const [layout, page] = pathname.split("/").filter((el) => el !== "");
  const navigate = useNavigate();

  // State để lưu trạng thái đăng nhập và thông tin người dùng
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [popoverOpen, setPopoverOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("userEmail");

    if (token && email) {
      setIsLoggedIn(true);

      // Gọi API để lấy thông tin tài khoản từ email
      fetchAccountDetails(email)
        .then((data) => {
          setUserDetails(data); // Lưu thông tin tài khoản vào state
        })
        .catch((error) => {
          console.error("Error fetching account details:", error);
          setIsLoggedIn(false);
        });
    }
  }, []);

  const handleLogout = () => {
    // Xóa token và thông tin người dùng khỏi localStorage khi đăng xuất
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    setUserDetails(null);
    navigate("/auth/sign-in"); // Điều hướng đến trang đăng nhập
  };

  return (
    <Navbar
      color={fixedNavbar ? "white" : "transparent"}
      className={`rounded-xl transition-all ${
        fixedNavbar
          ? "sticky top-4 z-40 py-3 shadow-md shadow-blue-gray-500/5"
          : "px-0 py-1"
      }`}
      fullWidth
      blurred={fixedNavbar}
    >
      <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
        <div className="capitalize">
          <Breadcrumbs
            className={`bg-transparent p-0 transition-all ${
              fixedNavbar ? "mt-1" : ""
            }`}
          >
            <Link to={`/${layout}`}>
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal opacity-50 transition-all hover:text-blue-500 hover:opacity-100"
              >
                {layout}
              </Typography>
            </Link>
            <Typography
              variant="small"
              color="blue-gray"
              className="font-normal"
            >
              {page}
            </Typography>
          </Breadcrumbs>
          <Typography variant="h6" color="blue-gray">
            {page}
          </Typography>
        </div>
        <div className="flex items-center">
          <div className="mr-auto md:mr-4 md:w-56">
            <Input label="Search" />
          </div>
          <IconButton
            variant="text"
            color="blue-gray"
            className="grid xl:hidden"
            onClick={() => setOpenSidenav(dispatch, !openSidenav)}
          >
            <Bars3Icon strokeWidth={3} className="h-6 w-6 text-blue-gray-500" />
          </IconButton>

          {/* Kiểm tra trạng thái đăng nhập */}
          {isLoggedIn && userDetails ? (
            <Popover open={popoverOpen} handler={setPopoverOpen}>
              <PopoverHandler>
                <Button
                  variant="text"
                  color="blue-gray"
                  onClick={() => setPopoverOpen(!popoverOpen)}
                >
                  {userDetails.fullName}
                </Button>
              </PopoverHandler>
              <PopoverContent className="p-4 bg-white border border-blue-gray-100 rounded-lg shadow-lg">
                <Typography variant="small" color="blue-gray" className="font-semibold">
                  Full Name: {userDetails.fullName}
                </Typography>
                <Typography variant="small" color="blue-gray">
                  Email: {userDetails.emailAddress}
                </Typography>
                <Typography variant="small" color="blue-gray">
                  Balance: ${userDetails.balance}
                </Typography>
                <Button
                  variant="text"
                  color="blue-gray"
                  className="mt-2"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </PopoverContent>
            </Popover>
          ) : (
            // Nếu chưa đăng nhập, hiển thị nút "Sign In"
            <Link to="/auth/sign-in">
              <Button
                variant="text"
                color="blue-gray"
                className="hidden items-center gap-1 px-4 xl:flex normal-case"
              >
                <UserCircleIcon className="h-5 w-5 text-blue-gray-500" />
                Sign In
              </Button>
              <IconButton
                variant="text"
                color="blue-gray"
                className="grid xl:hidden"
              >
                <UserCircleIcon className="h-5 w-5 text-blue-gray-500" />
              </IconButton>
            </Link>
          )}

          <IconButton
            variant="text"
            color="blue-gray"
            onClick={() => setOpenConfigurator(dispatch, true)}
          >
            <Cog6ToothIcon className="h-5 w-5 text-blue-gray-500" />
          </IconButton>
        </div>
      </div>
    </Navbar>
  );
}

DashboardNavbar.displayName = "/src/widgets/layout/dashboard-navbar.jsx";

export default DashboardNavbar;
