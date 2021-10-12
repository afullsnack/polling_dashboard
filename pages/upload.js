import { InboxOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";
import { useSession } from "next-auth/client";
import withLayout from "../components/layout";

const { Dragger } = Upload;

function UploadPage() {
  const props = {
    name: "file",
    multiple: true,
    action: "http://localhost:3000/api/upload",
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    beforeUpload(file) {
      const isCSVorXL = file.type === "text/csv";
      console.log(file.type);

      if (!isCSVorXL) {
        message.error("You can only upload CSV or EXCEL files! " + file.type);
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 5;
      if (!isLt2M) {
        message.warn("File must be smaller than 5MB!");
        return false;
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
    style: {
      maxHeight: 360,
    },
  };

  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return <p>Access Denied</p>;
  }

  return (
    <Dragger {...props}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">
        Click or drag file to this area to upload
      </p>
      <p className="ant-upload-hint">
        Support for a single or bulk upload. Strictly prohibit from uploading
        company data or other band files
      </p>
    </Dragger>
  );
}

export default withLayout(UploadPage);
