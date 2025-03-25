const puppeteer = require("puppeteer");

async function getMusicVideo(req, res, next) {
  try {
    const { artist, title } = req.query;
    const searchQuery = encodeURIComponent(`${artist} ${title}`);

    const url = `https://www.youtube.com/results?search_query=${searchQuery}`;

    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });

    // Extract the first non-ad video link
    const videoLink = await page.evaluate(() => {
      const video = document.querySelector("ytd-video-renderer a#thumbnail");
      return video
        ? `https://www.youtube.com${video.getAttribute("href")}`
        : null;
    });

    await browser.close();

    const videoId = videoLink.split("=")?.[1]?.split("&")?.[0];

    res.json({ videoId });
  } catch (e) {
    next(e);
  }
}

module.exports = {
  getMusicVideo,
};
