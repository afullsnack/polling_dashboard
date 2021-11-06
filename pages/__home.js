import { ArrowRightOutlined } from "@ant-design/icons";
import { Card, Col, Row } from "antd";
import Link from "next/link";
import withLayout from "../components/layout";

function Home() {
  return (
    <Row gutter={[8, 8]} style={{ margin: 0, padding: 0, width: "100%" }}>
      <Col xs={{ span: 24 }} md={{ span: 12 }}>
        <Link href="/report">
          <Card
            hoverable
            title="Reports"
            extra={<ArrowRightOutlined color="blue" />}
          >
            <h3>Reports from polling units</h3>
          </Card>
        </Link>
      </Col>
      <Col xs={{ span: 24 }} md={{ span: 12 }}>
        <Link href="/votes">
          <Card
            hoverable
            title="Polling data"
            extra={<ArrowRightOutlined color="blue" />}
          >
            <h3>Vote results from polling units</h3>
          </Card>
        </Link>
      </Col>
    </Row>
  );
}

export default withLayout(Home);
