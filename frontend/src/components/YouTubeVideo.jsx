import React, { useEffect, useRef } from "react";

export default function YouTubeVideo({
  videoId,
  setVideoEnded,
  songs,
  currentSongId,
  setCurrentSongId,
  setLoadingVideo,
}) {
  const playerRef = useRef(null); // Ref to hold the iframe element
  const songsRef = useRef(songs);

  useEffect(() => {
    songsRef.current = songs;
  }, [songs]);

  useEffect(() => {
    // Ensure the YouTube Iframe API is loaded only once
    if (!window.YT) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(script);

      // Define the function globally for YouTube API callback
      window.onYouTubeIframeAPIReady = initializePlayer;
    } else {
      // If API is already loaded, initialize the player immediately
      initializePlayer();
    }

    return () => {
      delete window.onYouTubeIframeAPIReady; // Clean up
    };
  }, []);

  useEffect(() => {
    if (playerRef.current?.loadVideoById) {
      playerRef.current.loadVideoById(videoId);
    }
  }, [videoId]);

  function initializePlayer() {
    if (!playerRef.current) {
      playerRef.current = new window.YT.Player("youtube-iframe", {
        videoId: videoId,
        playerVars: { autoplay: 1 },
        events: {
          onReady: (event) => {
            playerRef.current = event.target; // Store the player instance
          },
          onStateChange: handleStateChange,
        },
      });
    }
  }

  function handleStateChange(event) {
    if (event.data === window.YT.PlayerState.ENDED) {
      // Video has ended
      const currentSongsList = songsRef.current;
      const nextSongIndex =
        currentSongsList.findIndex((song) => song.id === currentSongId) + 1;
      if (nextSongIndex < currentSongsList.length) {
        setCurrentSongId(currentSongsList[nextSongIndex].id);
        setLoadingVideo(true);
      } else {
        setCurrentSongId(null);
      }
      setVideoEnded(true);
    }
  }

  return (
    <div>
      <div id="youtube-iframe"></div> {/* The container for the iframe */}
    </div>
  );
}
