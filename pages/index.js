// import Head from "next/head";
import Button from "antd/lib/button";
import Card from "antd/lib/card";
import Col from "antd/lib/col";
import Row from "antd/lib/row";
import { getProviders, useSession } from "next-auth/client";
// import styles from "../styles/Home.module.css";
// import withLayout from "components/globalLayout.js";
import { useRouter } from "next/router";
import { useState } from "react";

function Login({ providers }) {
  // connectDB();
  const router = useRouter();
  const [hasAccount, setHasAccount] = useState(true);
  const [session, loading] = useSession();
  return (
    <Row gutter={8} style={{ width: "100%", margin: 0, paddingTop: 150 }}>
      <Col
        xxs={{ span: 0 }}
        xs={{ span: 0 }}
        sm={{ span: 3 }}
        lg={{ span: 6 }}
      ></Col>
      <Col
        xxs={{ span: 24 }}
        xs={{ span: 24 }}
        sm={{ span: 18 }}
        lg={{ span: 12 }}
      >
        <Card hoverable style={{ textAlign: "center" }}>
          {/* {hasAccount && <LoginView />}
          {!hasAccount && <CreateAccountView />}
          {hasAccount && (
            <span style={{ fontSize: 12, marginTop: 20 }}>
              Don't have an account?
            </span>
          )}
          {!hasAccount && (
            <span style={{ fontSize: 12, marginTop: 20 }}>
              Already have an account?
            </span>
          )}
          <Button
            type="link"
            size="small"
            onClick={() => setHasAccount(!hasAccount)}
          >
            {hasAccount ? "create account" : "Login"}
          </Button> */}
          {/* {Object.values(providers).map((provider) => (
            <div key={provider.name}>
              <Button
                type="primary"
                onClick={() => signIn(provider.id)}
                style={{ marginBottom: 30 }}
                icon={
                  provider.name == "Google" ? (
                    <GoogleOutlined />
                  ) : (
                    <FacebookOutlined />
                  )
                }
              >
                Sign in with {provider.name}
              </Button>
            </div>
          ))} */}
          <Button
            type="primary"
            size="large"
            onClick={() => {
              router.push("/home");
            }}
          >
            Proceed to dashboard
          </Button>
        </Card>
      </Col>
      <Col
        xxs={{ span: 0 }}
        xs={{ span: 0 }}
        sm={{ span: 3 }}
        lg={{ span: 6 }}
      ></Col>
    </Row>
  );
}

export async function getServerSideProps(ctx) {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}

export default Login;
