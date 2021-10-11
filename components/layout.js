import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { createElement, useState } from "react";

export default function withLayout(BaseComp) {
  return function App() {
    const { Header, Sider, Content } = Layout;

    // state = {
    //   collapsed: false,
    // };
    const [collapsed, setCollapsed] = useState(false);

    const toggle = () => {
      setCollapsed(!collapsed);
    };

    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          trigger={null}
          breakpoint="lg"
          collapsible
          collapsed={collapsed}
          style={{ height: "inherit" }}
        >
          <div className="logo" />
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["1"]}
            style={{ height: "100%" }}
          >
            <Menu.Item key="1" icon={<UserOutlined />}>
              nav 1
            </Menu.Item>
            <Menu.Item key="2" icon={<VideoCameraOutlined />}>
              nav 2
            </Menu.Item>
            <Menu.Item key="3" icon={<UploadOutlined />}>
              nav 3
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }}>
            {createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: "trigger",
              onClick: toggle,
            })}
          </Header>
          <Content
            className="site-layout-background"
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 280,
            }}
          >
            <BaseComp />
          </Content>
        </Layout>

        <style jsx global>{`
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

          #components-layout-demo-custom-trigger .logo {
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
