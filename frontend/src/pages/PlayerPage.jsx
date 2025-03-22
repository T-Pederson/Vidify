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

  useEffect(() => {
    if (videoEnded) {
      setVideoId("SCyN9ftUMvE");
      setVideoEnded(false);
    }
  }, [videoEnded]);

  function changePlaylist() {
    navigate("/playlists");
  }

  return (
    <div className="playerPage">
      <img className="cornerLogo" src={logo} alt="Vidify logo" />
      <p className="changeLink" onClick={changePlaylist}>
        Change playlist
      </p>
      <SongsList />
      <YouTubeVideo videoId={videoId} setVideoEnded={setVideoEnded} />
    </div>
  );
}
