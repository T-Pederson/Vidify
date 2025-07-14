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

    const browser = await puppeteer.launch({
      executablePath: puppeteer.executablePath(),
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--disable-extensions",
        "--disable-plugins",
        "--no-zygote",
        "--single-process",
      ],
    });
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

async function alternateVideoId(req, res, next) {
  const artist = req.body.artist;
  const title = req.body.title;
  const altVideoId = req.body.altVideoId;

  // Determine if video Id is a valid Id
  const url = `https://www.youtube.com/watch?v=${altVideoId}`;

  const browser = await puppeteer.launch({
    executablePath: puppeteer.executablePath(),
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--disable-extensions",
      "--disable-plugins",
      "--no-zygote",
      "--single-process",
    ],
  });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });

  // Check if videoId is valid by looking for meta tag with property="og:title"
  const isValidVideo = await page.evaluate(() => {
    return document.querySelector('meta[property="og:title"]') !== null;
  });

  await browser.close();

  if (!isValidVideo) {
    res
      .status(404)
      .json({ error: `YouTube video not found for ID: ${altVideoId}` });
    return;
  }

  // Search DB for existing song entry
  let db = await connectDB();
  let collection = await db.collection("songs");
  let result = await collection.updateOne(
    { title: title, artist: artist },
    { $set: { videoId: altVideoId } }
  );

  if (result.matchedCount === 0) {
    res.status(404).json({
      error: `Song with Title: ${title} and Artist: ${artist} not found in database`,
    });
    return;
  }

  res.sendStatus(204);
}

module.exports = {
  getMusicVideo,
  alternateVideoId,
};
