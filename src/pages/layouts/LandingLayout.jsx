import {
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import { headerLogo } from "@assets/images";
import { ADMIN_MODULES } from "@constants/menu";
import { Button, Layout, Menu } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import Item from "antd/es/list/Item";
import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

const LandingLayout = ({ admin = false }) => {
  const [collapsed, setCollapsed] = useState(true);
  const [selectedKey, setSelectedKey] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const pathName = location.pathname.split("/").pop();
    setSelectedKey(pathName);
  }, [location.pathname]);

  const extractMenu = (modules) => {
    let items = [];
    modules.forEach((module) => {
      if (module.type === "group" && Array.isArray(module.children)) {
        const children = module.children.map((child) => ({
          key: child.value,
          icon: child.icon ? (
            <span className="flex items-center justify-center">
              {child.icon}
            </span>
          ) : null,
          label: <Link to={child.link}>{child.label}</Link>,
        }));
        items.push({
          key: module.value,
          icon: module.icon ? (
            <span className="flex items-center justify-center">
              {module.icon}
            </span>
          ) : null,
          label: module.label,
          children: children,
        });
      } else if (module.type === "item") {
        items.push({
          key: module.value,
          icon: module.icon ? (
            <span className="flex items-center justify-center">
              {module.icon}
            </span>
          ) : null,
          label: <Link to={module.link}>{module.label}</Link>,
        });
      }
    });
    return items;
  };

  const menuItems = extractMenu(ADMIN_MODULES);

  return (
    <Layout className="h-screen">
      <Header
        className="bg-linear-to-r from-[#00696e] from-0% to-b-primary to-60% opacity-80 h-16 px-12 items-center flex justify-between fixed w-full top-0"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.3)", zIndex: 1 }}
      >
        <div className="flex gap-2 justify-between items-center w-full">
          <img src={headerLogo} alt="Overwatch Logo" className="h-12" />
          {/* {admin && <div className="text-white text-base">Admin</div>} */}
          <Button type="link" onClick={() => navigate("/admin/dashboard")}>
            <span className="text-lg text-white/90 font-medium hover:text-gray-300">
              Admin
            </span>
          </Button>
        </div>
      </Header>
      <Content className="bg-linear-to-r from-[#00696e] from-0% to-b-primary to-60% h-full w-full overflow-auto">
        <Outlet />
      </Content>
      {admin && (
        <Sider
          width={330}
          collapsible
          collapsed={collapsed}
          trigger={null}
          onMouseEnter={() => setCollapsed(false)}
          onMouseLeave={() => setCollapsed(true)}
          className="custom-admin-sider overflow-hidden fixed left-4 top-20 bg-white/40 backdrop-blur-sm ring ring-white/10 rounded-lg shadow-xl"
          style={{ padding: 0 }}
        >
          <Menu
            defaultSelectedKeys={[selectedKey]}
            selectedKeys={[selectedKey]}
            mode="vertical"
            inlineCollapsed={collapsed}
            items={menuItems}
            className="custom-admin-menu bg-transparent font-medium text-base"
          />
        </Sider>
      )}
      {/* <Layout>
        <Sider
          width={300}
          className=" bg-white h-full w-full overflow-auto border-r border-black/20"
          // style={{ boxShadow: "2px 0 8px rgba(0,0,0,0.15)", zIndex: 2 }}
        >
          <Menu
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            mode="inline"
            // theme="dark"
            inlineCollapsed={false}
            items={menuItems}
            className="p-0"
          />
        </Sider>
      </Layout> */}
      {/* <Footer>Footer</Footer> */}
    </Layout>
  );
};

export default LandingLayout;
