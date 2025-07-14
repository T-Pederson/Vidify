// Disable this if running locally, only needed for Render deployment
const { join } = require("path");
/** @type {import("puppeteer").Configuration} */
module.exports = {
  cacheDirectory: join(__dirname, ".cache", "puppeteer"),
};
