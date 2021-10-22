import { Col, Row, Table } from "antd";
import "isomorphic-fetch";
import withLayout from "../components/layout";
import { url } from "../lib/config";
import { ExportCSV } from "../lib/exportToFile";

function Users({ users }) {
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Phone No",
      dataIndex: "phone",
    },
  ];

  // const userData = JSON.parse(users);

  const data = (typeof users === "object" ? [users] : users) || [];

  return (
    <Row gutter={[16, 16]} style={{ width: "100%", margin: 0, padding: 0 }}>
      <Col xs={{ span: 24 }} lg={{ span: 24 }}>
        <ExportCSV jsonData={data} fileName="user-data" />
      </Col>
      <Col xs={{ span: 24 }} lg={{ span: 24 }}>
        <Table columns={columns} dataSource={data} />
      </Col>
    </Row>
  );
}

export async function getServerSideProps(ctx) {
  var users = fetch(`${url}/api/user`, { method: "GET" })
    .then((res) => res.json())
    .catch((err) => console.log(err.message || err.toString()));
  users = JSON.stringify(users);
  console.log("users", users);
  return {
    props: {
      users,
    },
  };
}

export default withLayout(Users);
