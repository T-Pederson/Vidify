import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import logo from "../assets/vidify-logo.svg";
import YouTubeVideo from "../components/YouTubeVideo";
import SongsList from "../components/SongsList";

export default function PlayerPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const playlistId = queryParams.get("playlist");

  const [currentSongId, setCurrentSongId] = useState(null);
  const [videoId, setVideoId] = useState(null);
  const [videoEnded, setVideoEnded] = useState(true);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingVideo, setLoadingVideo] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/playlists/${playlistId}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setSongs(res.songs);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  }, [playlistId]);

  useEffect(() => {
    if (songs.length > 0 && currentSongId === null) {
      setCurrentSongId(songs[0]?.id);
    }
  }, [songs]);

  useEffect(() => {
    if (videoEnded && songs.length > 0 && currentSongId !== null) {
      const songsDetails = getSongDetails(currentSongId);

      if (!songsDetails) return;

      const queryParams = `artist=${encodeURIComponent(
        songsDetails.artist
      )}&title=${encodeURIComponent(songsDetails.title)}`;
      const url = `${
        import.meta.env.VITE_BACKEND_URL
      }/music-video?${queryParams}`;

      fetch(url, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((res) => {
          setVideoId(res.videoId);
          setVideoEnded(false);
          setLoadingVideo(false);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [videoEnded, songs, currentSongId]);

  useEffect(() => {
    const handleKeyUp = (e) => {
      if (e.key === "Escape") {
        const playerContainer = document.getElementById("playerContainer");
        if (playerContainer?.classList.contains("fullscreen")) {
          document
            .getElementById("playerContainer")
            ?.classList.remove("fullscreen");
        } else {
          document
            .getElementById("playerContainer")
            ?.classList.add("fullscreen");
        }
      }
      if (e.key === "ArrowLeft") {
        prevSong();
      }
      if (e.key === "ArrowRight") {
        nextSong();
      }
    };

    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [songs, currentSongId]);

  function getSongDetails(id) {
    if (!id) return null;
    const song = songs.find((song) => song.id === id);
    return {
      title: song.title,
      artist: song.artist,
    };
  }

  function selectSong(e) {
    const selectedSongId = e.currentTarget.id;
    if (selectedSongId === currentSongId) {
      return;
    }
    setCurrentSongId(selectedSongId);
    setVideoEnded(true);
    setLoadingVideo(true);
  }

  function shuffleRemainingSongs() {
    let currentSongIndex = songs.findIndex((song) => song.id === currentSongId);

    if (currentSongIndex === songs.length - 1) {
      return;
    }

    let playedSongs = songs.slice(0, currentSongIndex + 1);
    let remainingSongs = songs.slice(currentSongIndex + 1);

    for (let i = remainingSongs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [remainingSongs[i], remainingSongs[j]] = [
        remainingSongs[j],
        remainingSongs[i],
      ];
    }
    setSongs(playedSongs.concat(remainingSongs));
  }

  function sortByArtist() {
    let sortedSongs = [...songs];
    // First sort by song name
    sortedSongs.sort((a, b) => a.title.localeCompare(b.title));
    // Then sort by artist so songs are in alphabetical order by both title and artist
    sortedSongs.sort((a, b) => a.artist.localeCompare(b.artist));
    setSongs(sortedSongs);
  }

  function prevSong() {
    let currentSongIndex = songs.findIndex((song) => song.id === currentSongId);

    if (currentSongIndex <= 0) {
      return;
    }

    setCurrentSongId(songs[currentSongIndex - 1].id);
    setVideoEnded(true);
    setLoadingVideo(true);
  }

  function nextSong() {
    let currentSongIndex = songs.findIndex((song) => song.id === currentSongId);

    if (currentSongIndex >= songs.length - 1) {
      return;
    }

    setCurrentSongId(songs[currentSongIndex + 1].id);
    setVideoEnded(true);
    setLoadingVideo(true);
  }

  function goFullscreen() {
    document.getElementById("playerContainer").classList.add("fullscreen");
  }

  function submitAltVideoId(e) {
    e.preventDefault();
    const altVideoIdInput = document.getElementById("altVideoId");
    const curSong = songs.find((song) => song.id == currentSongId);
    fetch(`${import.meta.env.VITE_BACKEND_URL}/music-video/alt-video-id`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        artist: curSong.artist,
        title: curSong.title,
        altVideoId: altVideoIdInput.value,
      }),
    })
      .then(async (response) => {
        if (response.status !== 204) {
          try {
            const errorData = await response.json();
            console.log("Error:", errorData.error || "Unknown error");
          } catch (err) {
            console.log("Failed to parse error response:", err);
          }
        } else {
          altVideoIdInput.value = "";
          setVideoEnded(true);
          setLoadingVideo(true);
        }
      })
      .catch((error) => {
        console.log("Network or fetch error:", error);
      });
  }

  if (loading) {
    return <p className="loading">Loading...</p>;
  }

  return (
    <div className="playerPage">
      <header>
        <img className="cornerLogo" src={logo} alt="Vidify logo" />
        <div className="fullscreenButton" onClick={goFullscreen}>
          <p className="underlineClickable">Fullscreen</p>
          <p>
            (Esc to toggle fullscreen, left and right arrow keys to navigate
            songs)
          </p>
        </div>
        <Link to="/playlists">Change playlist</Link>
      </header>
      <div className="songListPlayerContainer">
        <SongsList
          songs={songs}
          selectSong={selectSong}
          currentSongId={currentSongId}
        />
        <div id="playerContainer">
          {loadingVideo ? (
            <p className="loadingVideo">Loading Video...</p>
          ) : (
            <YouTubeVideo
              videoId={videoId}
              setVideoEnded={setVideoEnded}
              songs={songs}
              currentSongId={currentSongId}
              setCurrentSongId={setCurrentSongId}
              setLoadingVideo={setLoadingVideo}
            />
          )}
        </div>
        <form className="altVideoContainer" onSubmit={submitAltVideoId}>
          <label htmlFor="altVideoId">Alternate Video Id: </label>
          <input
            type="text"
            id="altVideoId"
            name="altVideoId"
            placeholder="T3yPyc5ZdNs"
            autoComplete="off"
          />
          <button className="submit" type="submit">Submit</button>
        </form>
        <div className="controls">
          <p
            className="underlineClickable rightAlign"
            onClick={shuffleRemainingSongs}
          >
            Shuffle
          </p>
          <p className="underlineClickable leftAlign" onClick={sortByArtist}>
            Sort By Artist
          </p>
          <p className="underlineClickable rightAlign" onClick={prevSong}>
            Prev
          </p>
          <p className="underlineClickable leftAlign" onClick={nextSong}>
            Next
          </p>
        </div>
      </div>
    </div>
  );
}
