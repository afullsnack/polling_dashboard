import { ArrowRightOutlined } from "@ant-design/icons";
import { Card, Col, Row } from "antd";
import Link from "next/link";
import withLayout from "../components/layout";

function Home() {
  return (
    <Row gutter={[8, 8]} style={{ margin: 0, padding: 0, width: "100%" }}>
      <Col xs={{ span: 24 }} md={{ span: 12 }}>
        <Link href="/users">
          <Card
            hoverable
            title="Users"
            extra={<ArrowRightOutlined color="blue" />}
          >
            <h3>Mobile user data</h3>
          </Card>
        </Link>
      </Col>
      <Col xs={{ span: 24 }} md={{ span: 12 }}>
        <Link href="/data_vis">
          <Card
            hoverable
            title="Polling data"
            extra={<ArrowRightOutlined color="blue" />}
          >
            <h3>Go to polling data visualized</h3>
          </Card>
        </Link>
      </Col>
    </Row>
  );
}

export default withLayout(Home);
