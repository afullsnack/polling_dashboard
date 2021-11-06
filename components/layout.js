import {
  ContainerOutlined,
  DashboardOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Select } from "antd";
import { useSession } from "next-auth/client";
import Head from "next/head";
import { useRouter } from "next/router";
import { createElement, useState } from "react";
import { SWRConfig } from "swr";

export default function withLayout(BaseComp) {
  return function App(props) {
    const { Header, Sider, Content } = Layout;
    const router = useRouter();
    const Option = Select.Option;

    // state = {
    //   collapsed: false,
    // };
    const [collapsed, setCollapsed] = useState(true);
    const [key, setKey] = useState(router.asPath.replace("/", ""));
    console.log(router.asPath, key);

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
        <Head>
          <title>VCO - Dashboard</title>
          <meta name="description" content="VCO - Polling dashboard" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0,  user-scalable=no, maximum-scale=1"
          />
          <link rel="icon" href="/vco_logo.jpeg" />
          <link
            rel="preload"
            href="/api/report"
            as="fetch"
            crossorigin="anonymous"
          />
          <link
            rel="preload"
            href="/api/votes"
            as="fetch"
            crossorigin="anonymous"
          />
          <link
            rel="preload"
            href="/api/user"
            as="fetch"
            crossorigin="anonymous"
          />
        </Head>
        <Sider
          trigger={null}
          breakpoint="lg"
          collapsible
          collapsed={collapsed}
          collapsedWidth={0}
          style={{
            // height: "inherit",
            overflow: "hidden",
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
                ? router.replace("/")
                : // signOut({ callbackUrl: url })
                  router.push("/" + key);
            }}
          >
            <Menu.Item key="home" icon={<DashboardOutlined />}>
              Home
            </Menu.Item>
            <Menu.Item key="report" icon={<ContainerOutlined />}>
              Reports
            </Menu.Item>
            <Menu.Item key="users" icon={<UserOutlined />}>
              Users
            </Menu.Item>
            <Menu.Item key="upload" icon={<UploadOutlined />}>
              Upload
            </Menu.Item>
            <Menu.Item
              key="logout"
              icon={<LogoutOutlined />}
              style={{ color: "red" }}
            >
              Logout
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout
          className="site-layout"
          style={{
            height: "100%",
            overflowY: "scroll",
            marginLeft: collapsed ? 0 : 200,
          }}
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
              {/* <Select
                onChange={(value, option) => {
                  setSelectedLGA(value);
                }}
                placeholder="CHOOSE LGA"
                style={{
                  minWidth: 200,
                  marginRight: 10,
                }}
              >
                {lgas.map((val, i) => (
                  <Option key={i.toString()} value={val}>
                    {val.toUpperCase()}
                  </Option>
                ))}
              </Select>
              <Select
                onChange={(value, option) => {
                  setPollingUnit(value);
                }}
                placeholder="CHOOSE POLLING UNIT"
                style={{
                  minWidth: 200,
                }}
              >
                {polling_units.map((val, i) => (
                  <Option key={i.toString()} value={val}>
                    {val.toUpperCase()}
                  </Option>
                ))}
              </Select> */}
            </div>
          </Header>
          <Content
            className="site-layout-background"
            style={{
              margin: "40px 16px 24px 16px",
              padding: 24,
              minHeight: 280,
              overflowY: "initial",
            }}
          >
            <SWRConfig
              value={{
                refreshInterval: 3000,
                fetcher: (resource, init) =>
                  fetch(resource, init).then((res) => res.json()),
              }}
            >
              <BaseComp
                // selectedLGA={selectedLGA}
                // pollingUnit={pollingUnit}
                {...props}
              />
            </SWRConfig>
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
            margin: 26px;
            height: 155px;
            background: rgba(255, 255, 255, 0.3);
            background-image: url("/vco_logo.jpeg");
            background-position: center;
            background-size: cover;
            background-repeat: no-repeat;
            border-radius: 100%;

            display: flex;
            align-items: center;
            justify-content: center;
            padding: auto 10px;
            color: white;
            font-weight: bolder;
          }

          .site-layout {
            transition: margin-left 0.1s linear 0s;
          }

          .site-layout .site-layout-background {
            background: #fff;
          }
        `}</style>
      </Layout>
    );
  };
}
