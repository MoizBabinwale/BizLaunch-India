const fs = require("fs");
const path = require("path");

const source = path.resolve(__dirname, "../BizLaunch.apk");
const destination = path.resolve(__dirname, "../public/BizLaunch-India.apk");

if (!fs.existsSync(source)) {
  throw new Error(`Android app package not found: ${source}`);
}

fs.copyFileSync(source, destination);
