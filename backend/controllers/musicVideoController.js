const puppeteer = require("puppeteer");
const connectDB = require("../db/conn");

async function getMusicVideo(req, res, next) {
  try {
    const { artist, title } = req.query;

    // Search DB for link to song
    let db = await connectDB();
    let collection = await db.collection("songs");
    let query = {
      $and: [{ title: title }, { artist: artist }],
    };
    let findResult = await collection.findOne(query);
    if (findResult) {
      res.json({ videoId: findResult.videoId });
      return;
    }

    // Song not yet in DB, use webscraper to find link
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

    // Save song to db
    let newDocument = {
      title: title,
      artist: artist,
      videoId: videoId,
    };
    await collection.insertOne(newDocument);

    res.json({ videoId });
  } catch (e) {
    next(e);
  }
}

module.exports = {
  getMusicVideo,
};
