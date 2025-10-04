"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SidebarItem from "@/components/Admin/Sidebar/SidebarItem";
import ClickOutside from "@/components/Admin/ClickOutside";
import useLocalStorage from "@/hooks/useLocalStorage";
import logo from "../../../../public/logo.png";

// Importing Material UI icons to replace custom SVGs
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ArticleIcon from "@mui/icons-material/Article";
import CategoryIcon from "@mui/icons-material/Category";
import QrCodeIcon from "@mui/icons-material/QrCode";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const menuGroups = [
  {
    menuItems: [
      {
        icon: <DashboardIcon fontSize="medium" />,
        label: "Dashboard",
        route: "/admin",
      },
      {
        icon: <PersonIcon fontSize="medium" />,
        label: "User",
        route: "#",
        children: [
          { label: "Add User", route: "/admin/user/add-user" },
          { label: "User Table", route: "/admin/user" },
          // { label: "Transaction Table", route: "/admin/user/transaction" },
        ],
      },
      {
        icon: <MenuBookIcon fontSize="medium" />,
        label: "Product",
        route: "#",
        children: [
          { label: "Add Product", route: "/admin/product/add-product" },
          { label: "Product Table", route: "/admin/product/product-table" },
        ],
      },
      {
        icon: <CategoryIcon fontSize="medium" />,
        label: "Categories",
        route: "#",
        children: [
          { label: "Add Category", route: "/admin/categories/add-categories" },
          {
            label: "Category Table",
            route: "/admin/categories/categories-table",
          },
        ],
      },
      {
        icon: <CategoryIcon fontSize="medium" />,
        label: "Sub-Categories",
        route: "#",
        children: [
          {
            label: "Add Sub-Category",
            route: "/admin/subcategories/add-subcategories",
          },
          {
            label: "Sub-Category Table",
            route: "/admin/subcategories/subcategories-table",
          },
        ],
      },
      {
        icon: <QrCodeIcon fontSize="medium" />,
        label: "Product Qr",
        route: "#",
        children: [
          { label: "Generate Qr Code", route: "/admin/qr/generate-productqr" },
          { label: "Qr Code Table", route: "/admin/qr/productqr-table" },
        ],
      },
      {
        icon: <AccountBalanceWalletIcon fontSize="medium" />,
        label: "Withdrawal Table",
        route: "/admin/withdrawal/withdrawal-table",
      },
      {
        icon: <QrCodeIcon fontSize="medium" />,
        label: "Ticket Table",
        route: "/admin/ticket/ticket-table",
        // children: [
        //   // { label: "Generate Qr Code", route: "/admin/qr/generate-productqr" },
        //   { label: "Ticket Table", route: "/admin/ticket/ticket-table" },
        // ],
      },
    ],
  },
];

// Sidebar component handles showing/hiding and renders menu items.
const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();

  // We use localStorage to remember which menu item was last selected
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");

  return (
    // ClickOutside component will close the sidebar when clicking outside of it for better UX
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden shadow-xl border-stroke dark:border-stroke-dark dark:bg-gray-dark lg:static lg:translate-x-0 ${
          sidebarOpen
            ? "translate-x-0 duration-300 ease-linear bg-white"
            : "-translate-x-full"
        }`}
        // style={{ background: "url('/img/AstroBg2.png')" }}
      >
        {/* Sidebar header with the logo and a toggle button for smaller screens */}
        <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5 xl:py-4.5">
          <Link href="/admin">
            <Image
              src={logo}
              alt="Logo"
              priority
              className="block w-[180px] h-[140px] mx-auto"
              width={180}
              height={180}
            />
          </Link>

          {/* Button visible only on small screens to toggle sidebar */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="block lg:hidden"
            aria-label="Toggle sidebar"
          >
            <svg
              className="fill-current"
              width="20"
              height="18"
              viewBox="0 0 20 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
                fill=""
              />
            </svg>
          </button>
        </div>

        {/* Sidebar menu items with scrollable container */}
        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          <nav className="mt-1 px-4 lg:px-6">
            {menuGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <ul className="mb-6 flex flex-col gap-2">
                  {group.menuItems.map((menuItem, menuIndex) => (
                    <SidebarItem
                      key={menuIndex}
                      item={menuItem}
                      pageName={pageName}
                      setPageName={setPageName}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </ClickOutside>
  );
};

export default Sidebar;
