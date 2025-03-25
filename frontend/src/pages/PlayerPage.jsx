import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/vidify-logo.svg";
import YouTubeVideo from "../components/YouTubeVideo";
import SongsList from "../components/SongsList";
// import songsData from "./songs.json";

export default function PlayerPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const playlistId = queryParams.get("playlist");

  const [currentSongId, setCurrentSongId] = useState(null);
  const [videoId, setVideoId] = useState(null);
  const [videoEnded, setVideoEnded] = useState(true);
  // const [songs, setSongs] = useState(songsData.songs);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("fetching songs");
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
      console.log("fetching video")
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
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [videoEnded, songs, currentSongId]);

  if (loading) {
    return null;
  }

  function changePlaylist() {
    navigate("/playlists");
  }

  function getSongDetails(id) {
    if (!id) return null;
    const song = songs.find(song => song.id === id);
    return {
      title: song.title,
      artist: song.artist,
    };
  }

  function selectSong(e) {
    setCurrentSongId(e.currentTarget.id);
    setVideoEnded(true);
  }

  return (
    <div className="playerPage">
      <img className="cornerLogo" src={logo} alt="Vidify logo" />
      <p className="changeLink" onClick={changePlaylist}>
        Change playlist
      </p>
      <SongsList songs={songs} selectSong={selectSong} currentSongId={currentSongId}/>
      <YouTubeVideo videoId={videoId} setVideoEnded={setVideoEnded} />
    </div>
  );
}
