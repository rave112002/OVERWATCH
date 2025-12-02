import {
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import { headerLogo } from "@assets/images";
import { MODULES } from "@constants/menu";
import { Button, Layout, Menu } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import React from "react";
import { Link, Outlet } from "react-router";

const LandingLayout = () => {
  const extractMenu = (modules) => {
    let items = [];
    modules.forEach((module) => {
      if (module.type === "group" && Array.isArray(module.children)) {
        const children = module.children.map((child) => ({
          key: child.value,
          icon: child.icon,
          label: <Link to={child.link}>{child.label}</Link>,
        }));
        items.push({
          key: module.value,
          icon: module.icon,
          label: module.label,
          children: children,
        });
      } else if (module.type === "item") {
        items.push({
          key: module.value,
          icon: module.icon,
          label: <Link to={module.link}>{module.label}</Link>,
        });
      }
    });
    return items;
  };

  const menuItems = extractMenu(MODULES);

  return (
    <Layout className="h-screen">
      <Header
        className="bg-linear-to-r from-[#00696e] from-0% to-b-primary to-100% opacity-85 h-16 px-12 items-center flex justify-between fixed w-full top-0"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.3)", zIndex: 1 }}
      >
        <div className="flex gap-2 justify-between items-center w-full">
          <img src={headerLogo} alt="Overwatch Logo" className="h-10" />
          <div className="text-white text-base">Admin</div>
        </div>
      </Header>
      <Content className="bg-white h-full w-full overflow-auto">
        <Outlet />
      </Content>
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
