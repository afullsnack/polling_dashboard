import { Card, Col, Row } from "antd";
import { Bar, Doughnut, Line, Pie } from "react-chartjs-2";
import withLayout from "../components/layout";

function Home({ selectedLGA, pollingUnit }) {
  const data = {
    labels: ["Test label", "Test label 2", "And so on"],
    datasets: [
      {
        label: "First dataset",
        data: [55, 131, 75],
        backgroundColor: ["red", "blue", "brown"],
        borderWidth: 1,
      },
      {
        label: "Second dataset",
        data: [21, 56, 12],
        backgroundColor: ["green", "purple", "yellow"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Row gutter={[16, 16]} style={{ width: "100%", margin: 0, padding: 0 }}>
      <Col xs={{ span: 24 }} lg={{ span: 12 }}>
        <Card hoverable title={`${pollingUnit} Standings`}>
          <Doughnut data={data} />
        </Card>
      </Col>
      <Col xs={{ span: 24 }} lg={{ span: 12 }}>
        <Card hoverable title={`${pollingUnit} Polling rounds`}>
          <Pie data={data} />
        </Card>
      </Col>
      <Col xs={{ span: 24 }} lg={{ span: 12 }}>
        <Card hoverable title={`${pollingUnit} Unit counts`}>
          <Line data={data} />
        </Card>
      </Col>
      <Col xs={{ span: 24 }} lg={{ span: 12 }}>
        <Card hoverable title={`${pollingUnit} Voters counts`}>
          <Bar data={data} />
        </Card>
      </Col>
    </Row>
  );
}

export default withLayout(Home);
