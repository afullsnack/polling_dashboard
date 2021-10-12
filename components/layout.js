import {
  DashboardOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Select } from "antd";
import { signOut, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { createElement, useState } from "react";
import { lgas, polling_units } from "../lib/anambra_lgas";
import { url } from "../lib/config";

export default function withLayout(BaseComp) {
  return function App() {
    const { Header, Sider, Content } = Layout;
    const router = useRouter();
    const Option = Select.Option;

    // state = {
    //   collapsed: false,
    // };
    const [collapsed, setCollapsed] = useState(false);
    const [key, setKey] = useState(
      router.asPath.includes("upload") ? "upload" : "home"
    );

    const toggle = () => {
      setCollapsed(!collapsed);
    };

    const { data: session, status } = useSession();

    if (status === "loading") {
      return <p>Loading...</p>;
    }

    if (status === "unauthenticated") {
      return <p>Access Denied</p>;
    }

    return (
      <Layout style={{ minHeight: "100vh", overflowY: "hidden" }}>
        <Sider
          trigger={null}
          breakpoint="lg"
          collapsible
          collapsed={collapsed}
          style={{
            // height: "inherit",
            overflow: "auto",
            height: "100vh",
            position: "fixed",
            left: 0,
          }}
        >
          <div className="logo" />
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={[key]}
            style={{ height: "100%" }}
            onSelect={({ item, key, selectedKeys }) => {
              // console.log(item, key, selectedKeys);
              setKey(key);
              key == "logout"
                ? signOut({ callbackUrl: url })
                : router.push("/" + key);
            }}
          >
            <Menu.Item key="home" icon={<DashboardOutlined />}>
              Home
            </Menu.Item>
            <Menu.Item key="upload" icon={<UploadOutlined />}>
              Upload
            </Menu.Item>
            <Menu.Item key="logout" icon={<UserOutlined />}>
              Logout
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout
          className="site-layout"
          style={{ height: "100%", overflowY: "scroll", marginLeft: 200 }}
        >
          <Header
            className="site-layout-background"
            style={{
              padding: "0 20px",
              position: "sticky",
              zIndex: 1,
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: "trigger",
              onClick: toggle,
            })}
            <div
              style={{
                display: "flex",
                float: "right",
                overflow: "hidden",
                zIndex: 2,
              }}
            >
              <Select
                onChange={(value, option) => {
                  console.log(value, option);
                }}
                placeholder="CHOOSE LGA"
                style={{
                  minWidth: 200,
                  marginRight: 10,
                }}
              >
                {lgas.map((val, i) => (
                  <Option value={val}>{val.toUpperCase()}</Option>
                ))}
              </Select>
              <Select
                onChange={(value, option) => {
                  console.log(value, option);
                }}
                placeholder="CHOOSE POLLING UNIT"
                style={{
                  minWidth: 200,
                }}
              >
                {polling_units.map((val, i) => (
                  <Option value={val}>{val.toUpperCase()}</Option>
                ))}
              </Select>
            </div>
          </Header>
          <Content
            className="site-layout-background"
            style={{
              margin: "88px 16px 24px 16px",
              padding: 24,
              minHeight: 280,
              overflowY: "initial",
            }}
          >
            <BaseComp />
          </Content>
        </Layout>

        <style jsx global>{`
          html,
          body {
            width: 100%;
            height: 100vh;
            margin: 0;
            padding: 0;
            // overflow: hidden;
          }
          #components-layout-demo-custom-trigger .trigger {
            padding: 0 24px;
            font-size: 18px;
            line-height: 64px;
            cursor: pointer;
            transition: color 0.3s;
          }

          #components-layout-demo-custom-trigger .trigger:hover {
            color: #1890ff;
          }

          .logo {
            height: 32px;
            margin: 16px;
            background: rgba(255, 255, 255, 0.3);
          }

          .site-layout .site-layout-background {
            background: #fff;
          }
        `}</style>
      </Layout>
    );
  };
}
