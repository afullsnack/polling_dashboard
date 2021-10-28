import { InboxOutlined } from "@ant-design/icons";
import { Button, message, Upload } from "antd";
import withLayout from "../components/layout";
// import { parseFile } from "../lib/parseFile";
import { url } from "../lib/config";

const { Dragger } = Upload;

function UploadPage() {
  const props = {
    name: "file",
    multiple: true,
    action: `${url}/api/upload`,
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
        console.log(info.file.path);
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

  return (
    <>
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
      <Button
        onClick={() => {
          parseFile();
        }}
      >
        PARSE FILE
      </Button>
    </>
  );
}

export default withLayout(UploadPage);
