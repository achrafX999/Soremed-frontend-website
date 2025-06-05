import type React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Package2, ClipboardList, Newspaper, Shield, LogOut } from "lucide-react";

const ServiceAchatSidebar: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === `/achat${path}`;

  const menuItems = [
    { path: "", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/catalog", icon: Package2, label: "Catalog" },
    { path: "/orders", icon: ClipboardList, label: "Orders" },
    { path: "/news", icon: Newspaper, label: "News" },
  ];

  return (
    <div className="w-64 bg-white h-screen fixed left-0 top-0 shadow-lg">
      <div className="p-6 border-b">
        <Link to="/achat" className="flex items-center">
          <Shield className="h-8 w-8 text-blue-600" />
          <span className="ml-2 text-xl font-bold text-gray-900">Achat Panel</span>
        </Link>
      </div>

      <nav className="mt-6">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={`/achat${item.path}`}
            className={`flex items-center px-6 py-3 text-sm font-medium ${
              isActive(item.path)
                ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.label}
          </Link>
        ))}

        <Link
          to="/"
          className="flex items-center px-6 py-3 text-sm font-medium text-red-600 hover:bg-red-50 mt-auto absolute bottom-4 w-full"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Exit Achat
        </Link>
      </nav>
    </div>
  );
};

export default ServiceAchatSidebar;