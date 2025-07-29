import React, { useEffect, useRef } from "react";

export default function YouTubeVideo({
  videoId,
  setVideoEnded,
  songs,
  currentSongId,
  setCurrentSongId,
  setLoadingVideo,
}) {
  const playerRef = useRef(null);
  const songsRef = useRef(songs);

  useEffect(() => {
    songsRef.current = songs;
  }, [songs]);

  useEffect(() => {
    if (!window.YT) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(script);
      window.onYouTubeIframeAPIReady = initializePlayer;
    } else {
      initializePlayer();
    }

    return () => {
      delete window.onYouTubeIframeAPIReady;
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
        playerVars: {
          fs: 1,
          autoplay: 1,
          rel: 0,
          modestbranding: 1,
          iv_load_policy: 3,
        },
        events: {
          onReady: (event) => {
            playerRef.current = event.target;
          },
          onStateChange: handleStateChange,
        },
      });
    }
  }

  function handleStateChange(event) {
    window.focus();
    if (event.data === window.YT.PlayerState.ENDED) {
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
    <div style={{ width: "100%", maxWidth: "1120px" }}>
      <div id="youtube-iframe"></div>
    </div>
  );
}
