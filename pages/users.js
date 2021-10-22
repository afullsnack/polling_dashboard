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
  console.log("Client users", users);

  const data = users || [];

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
  const { data, error, message } = await fetch(`${url}/api/user`, {
    method: "GET",
  })
    .then((res) => res.json())
    .catch((err) => console.log(err.message || err.toString()));

  if (error) {
    return {
      props: {},
    };
  }
  // var users = JSON.stringify(data);
  console.log("users", data, message, error);
  return {
    props: {
      users: data,
    },
  };
}
export default withLayout(Users);
