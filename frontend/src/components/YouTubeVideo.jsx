import React, { useEffect, useRef } from "react";

const YouTubeVideo = ({ videoId, setVideoEnded }) => {
  const playerRef = useRef(null); // Ref to hold the iframe element

  const createPlayer = () => {
    // Cleanup the previous player if it exists
    cleanupPlayer();

    // Create a new player with the updated videoId
    playerRef.current = new window.YT.Player("youtube-iframe", {
      videoId: videoId,
      events: {
        onStateChange: handleStateChange,
      },
    });
  };

  const cleanupPlayer = () => {
    if (playerRef.current) {
      playerRef.current.destroy(); // Destroy the existing player instance
      playerRef.current = null;
    }
  };

  useEffect(() => {
    // Ensure the YouTube Iframe API is loaded only once
    if (!window.YT) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(script);

      // Wait for the API to be ready
      window.onYouTubeIframeAPIReady = createPlayer;
    } else {
      // If the API is already loaded, create the player immediately
      createPlayer();
    }

    // Cleanup player when the component is unmounted or videoId changes
    return cleanupPlayer;
  }, [videoId]); // This effect will run when videoId changes

  const handleStateChange = (event) => {
    if (event.data === window.YT.PlayerState.ENDED) {
      // Video has ended
      setVideoEnded(true);
    }
  };

  return (
    <div>
      <div id="youtube-iframe"></div> {/* The container for the iframe */}
    </div>
  );
};

export default YouTubeVideo;
