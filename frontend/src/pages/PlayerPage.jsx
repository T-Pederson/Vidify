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

      fetch(
        `${import.meta.env.VITE_BACKEND_URL}/music-video?artist=${
          songsDetails.artist
        }&title=${songsDetails.title}`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      )
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

  if (loading) {
    return <p className="loading">Loading...</p>;
  }

  function getSongDetails(id) {
    if (!id) return null;
    const song = songs.find((song) => song.id === id);
    return {
      title: song.title,
      artist: song.artist,
    };
  }

  function selectSong(e) {
    setCurrentSongId(e.currentTarget.id);
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

  return (
    <div className="playerPage">
      <header>
        <img className="cornerLogo" src={logo} alt="Vidify logo" />
        <Link to="/playlists">Change playlist</Link>
      </header>
      <div className="songListPlayerContainer">
        <SongsList
          songs={songs}
          selectSong={selectSong}
          currentSongId={currentSongId}
        />
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
      <p className="underlineClickable" onClick={shuffleRemainingSongs}>
        Shuffle
      </p>
    </div>
  );
}
