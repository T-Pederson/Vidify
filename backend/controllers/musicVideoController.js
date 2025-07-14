const connectDB = require("../db/conn");

async function getMusicVideo(req, res, next) {
  try {
    const { artist, title } = req.query;
    const searchQuery = `${artist} ${title}`;

    // Check DB first
    const db = await connectDB();
    const collection = db.collection("songs");
    const existing = await collection.findOne({ title, artist });
    if (existing) {
      return res.json({ videoId: existing.videoId });
    }

    const apiKey = process.env.YOUTUBE_API_KEY;
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
      searchQuery
    )}&key=${apiKey}&maxResults=1&type=video`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`YouTube API error: ${response.status}`);
    const data = await response.json();

    const videoId = data.items?.[0]?.id?.videoId;
    if (!videoId) return res.status(404).json({ error: "Video not found" });

    await collection.insertOne({ title, artist, videoId });
    res.json({ videoId });
  } catch (err) {
    next(err);
  }
}


async function alternateVideoId(req, res, next) {
  try {
    const { artist, title, altVideoId } = req.body;
    const apiKey = process.env.YOUTUBE_API_KEY;

    // Call YouTube API to check if video ID exists
    const url = `https://www.googleapis.com/youtube/v3/videos?part=id&id=${altVideoId}&key=${apiKey}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();
    const videoExists = data.items && data.items.length > 0;

    if (!videoExists) {
      return res
        .status(404)
        .json({ error: `YouTube video not found for ID: ${altVideoId}` });
    }

    // Update DB entry with the new valid videoId
    const db = await connectDB();
    const collection = db.collection("songs");

    const result = await collection.updateOne(
      { title, artist },
      { $set: { videoId: altVideoId } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        error: `Song with Title: ${title} and Artist: ${artist} not found in database`,
      });
    }

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getMusicVideo,
  alternateVideoId,
};
