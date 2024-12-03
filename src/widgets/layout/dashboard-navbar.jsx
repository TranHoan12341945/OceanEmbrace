import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  Navbar,
  Typography,
  Button,
  IconButton,
  Breadcrumbs,
  Popover,
  PopoverHandler,
  PopoverContent,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  Cog6ToothIcon,
  Bars3Icon,
} from "@heroicons/react/24/solid";
import {
  useMaterialTailwindController,
  setOpenConfigurator,
  setOpenSidenav,
} from "@/context";
import { fetchAccountDetails } from "@/api";

export function DashboardNavbar() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { fixedNavbar, openSidenav } = controller;
  const { pathname } = useLocation();
  const [layout, page] = pathname.split("/").filter((el) => el !== "");
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [popoverOpen, setPopoverOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setIsLoggedIn(true);

      fetchAccountDetails()
        .then((data) => {
          console.log("Fetched Profile Data:", data);

          setUserDetails({
            fullName: data.fullName || "Unknown",
            emailAddress: data.emailAddress || "Unknown",
            avatar:
              "https://static.vecteezy.com/system/resources/previews/009/734/564/non_2x/default-avatar-profile-icon-of-social-media-user-vector.jpg",
            balance: data.balance || 0,
          });
        })
        .catch((error) => {
          console.error("Error fetching account details:", error);
          setIsLoggedIn(false);
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    setUserDetails(null);
    navigate("/auth/sign-in");
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
          <IconButton
            variant="text"
            color="blue-gray"
            className="grid xl:hidden"
            onClick={() => setOpenSidenav(dispatch, !openSidenav)}
          >
            <Bars3Icon strokeWidth={3} className="h-6 w-6 text-blue-gray-500" />
          </IconButton>

          {isLoggedIn && userDetails ? (
            <Popover open={popoverOpen} handler={setPopoverOpen}>
              <PopoverHandler>
                <Button
                  variant="text"
                  color="blue-gray"
                  onClick={() => setPopoverOpen(!popoverOpen)}
                  className="flex items-center gap-2"
                >
                  <img
                    src={userDetails.avatar}
                    alt="Avatar"
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  {userDetails.fullName}
                </Button>
              </PopoverHandler>
              <PopoverContent className="p-4 bg-white border border-blue-gray-100 rounded-lg shadow-lg">
                <div className="flex flex-col items-center">
                  <img
                    src={userDetails.avatar}
                    alt={`${userDetails.fullName}'s Avatar`}
                    className="h-16 w-16 rounded-full border border-gray-200 object-cover mb-4"
                  />
                  <Typography variant="small" color="blue-gray" className="font-semibold">
                    Full Name: {userDetails.fullName}
                  </Typography>
                  <Typography variant="small" color="blue-gray">
                    Email: {userDetails.emailAddress}
                  </Typography>
                  <Typography variant="small" color="blue-gray">
                    Balance: ${userDetails.balance.toFixed(2)}
                  </Typography>
                  <Button
                    variant="text"
                    color="blue-gray"
                    className="mt-2"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
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
