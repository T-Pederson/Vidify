import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/vidify-logo.svg";
import YouTubeVideo from "../components/YouTubeVideo";
import SongsList from "../components/SongsList";

export default function PlayerPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const playlistId = queryParams.get("playlist");

  const [videoId, setVideoId] = useState("SWkvpy29pRY");
  const [videoEnded, setVideoEnded] = useState(false);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (videoEnded) {
      setVideoId("SCyN9ftUMvE");
      setVideoEnded(false);
    }
  }, [videoEnded]);

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
  });

  if (loading) {
    return null;
  }

  function changePlaylist() {
    navigate("/playlists");
  }

  return (
    <div className="playerPage">
      <img className="cornerLogo" src={logo} alt="Vidify logo" />
      <p className="changeLink" onClick={changePlaylist}>
        Change playlist
      </p>
      <SongsList songs={songs} />
      <YouTubeVideo videoId={videoId} setVideoEnded={setVideoEnded} />
    </div>
  );
}
