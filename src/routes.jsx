import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
  PaintBrushIcon,
  ClipboardDocumentCheckIcon, // Biểu tượng mới cho Orders
  
} from "@heroicons/react/24/solid";
import { Home, Profile, Tables, Notifications } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";
import { ArtworksTable } from "@/pages/dashboard/ArtworksTable";
import { Orders } from "@/pages/dashboard/Orders"; // Import thêm Orders component
import { Reports } from "@/pages/dashboard/Reports";
import Balance from "@/pages/dashboard/Balance";

// import Balance from "../pages/dashboard/Balance";


const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "Artist Management",
        path: "/artist",
        element: <Profile />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "tables",
        path: "/tables",
        element: <Tables />,
      },
      // {
      //   icon: <InformationCircleIcon {...icon} />,
      //   name: "notifications",
      //   path: "/notifications",
      //   element: <Notifications />,
      // },
      {
        icon: <PaintBrushIcon {...icon} />,
        name: "artworks",
        path: "/artworks",
        element: <ArtworksTable />,
      },
      {
        icon: <ClipboardDocumentCheckIcon {...icon} />, // Thêm biểu tượng cho trang Orders
        name: "orders", // Đặt tên trang là Orders
        path: "/orders", // Đường dẫn cho Orders
        element: <Orders />, // Trỏ đến component Orders
      },
      {
        icon: <TableCellsIcon {...icon} />, // Thêm biểu tượng cho trang Reports
        name: "reports", // Đặt tên trang là Reports
        path: "/reports", // Đường dẫn cho Reports
        element: <Reports />, // Trỏ đến component Reports
      },
      {
        icon: <InformationCircleIcon {...icon} />, // Thêm biểu tượng cho trang Balance
        name: "balance",
        path: "/balance",
        element: <Balance />, // Trỏ đến component Balance
      },
    ],
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "sign in",
        path: "/sign-in",
        element: <SignIn />,
      },
      // {
      //   icon: <RectangleStackIcon {...icon} />,
      //   name: "sign up",
      //   path: "/sign-up",
      //   element: <SignUp />,
      // },
    ],
  },
];

export default routes;
