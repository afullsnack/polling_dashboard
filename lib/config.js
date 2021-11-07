const pdata = require("../lib/parsedData.json");
const dev = process.env.NODE_ENV !== "production";

const url = dev
  ? "http://localhost:3000"
  : "https://polling-dashboard-beta.vercel.app";

export { pdata, url };
