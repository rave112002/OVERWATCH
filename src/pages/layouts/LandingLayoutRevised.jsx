import {
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  PieChartOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { headerLogo } from "@assets/images";
import { ADMIN_MODULES } from "@constants/menu";
import { Button, Layout, Menu } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import Item from "antd/es/list/Item";
import { Icon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

const LandingLayoutRevised = ({ admin }) => {
  // const [collapsed, setCollapsed] = useState(true);
  const [selectedKey, setSelectedKey] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setSelectedKey(location.pathname);
  }, [location.pathname]);

  const extractMenu = (modules) => {
    let items = [];

    modules.forEach((module) => {
      if (module.type === "group" && Array.isArray(module.children)) {
        const children = module.children.map((child) => {
          const ChildIcon = child.icon;

          return {
            key: child.link,
            icon: ChildIcon ? (
              <span className="flex items-center justify-center">
                <ChildIcon
                  size={18}
                  color={selectedKey === child.value ? "#60a5fa" : "#ffffff"}
                  strokeWidth={2.5}
                />
              </span>
            ) : null,
            label: (
              <Link
                to={child.link}
                className={`${selectedKey === child.link ? "font-extrabold" : "font-extralight"}`}
              >
                {child.label}
              </Link>
            ),
          };
        });

        const ModuleIcon = module.icon;

        items.push({
          key: module.value,
          icon: ModuleIcon ? (
            <span className="flex items-center justify-center">
              <ModuleIcon
                size={18}
                color={selectedKey === module.link ? "#60a5fa" : "#ffffff"}
                strokeWidth={2.5}
              />
            </span>
          ) : null,
          label: module.label,
          children,
        });
      }

      if (module.type === "item") {
        const ModuleIcon = module.icon;

        items.push({
          key: module.link,
          icon: ModuleIcon ? (
            <span className="flex items-center justify-center h-full">
              <ModuleIcon
                size={18}
                color={selectedKey === module.link ? "#60a5fa" : "#ffffff"}
                strokeWidth={2.5}
              />
            </span>
          ) : null,
          label: (
            <Link
              to={module.link}
              className={`${selectedKey === module.value ? "font-extrabold" : "font-extralight"}`}
            >
              {module.label}
            </Link>
          ),
        });
      }
    });

    return items;
  };

  const menuItems = extractMenu(ADMIN_MODULES);

  // console.log(menuItems);

  return (
    <Layout className="h-screen relative">
      <Header className="h-16 w-full fixed top-4 p-0 bg-transparent z-50">
        <div className="h-full bg-b-header mx-4 rounded-full px-8 flex gap-6 justify-between items-center">
          <img src={headerLogo} alt="Overwatch Logo" className="h-10" />
          {admin && (
            <Menu
              mode="horizontal"
              items={menuItems}
              selectedKeys={[selectedKey]}
              className="flex-1"
            />
          )}
          <Button type="link" onClick={() => navigate("/admin/dashboard")}>
            <span className="text-base text-white/90 font-medium hover:text-gray-300">
              Admin
            </span>
          </Button>
        </div>
      </Header>

      <Content className="w-full h-full bg-[url('/src/assets/images/bg.png')] bg-cover bg-center">
        <Outlet />
      </Content>
    </Layout>
  );
};

export default LandingLayoutRevised;
