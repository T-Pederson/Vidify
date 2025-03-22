import { useEffect, useState } from "react";
import logo from "../assets/vidify-logo.svg";
import { useNavigate } from "react-router-dom";
import playlistsData from "./playlists.json";
import PlaylistTile from "../components/PlaylistTile";

export default function PlaylistsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("currentUser")) {
      navigate("/");
    } else {
      setLoading(false);
    }
  }, [navigate]);

  if (loading) {
    return null;
  }

  function changeUser() {
    localStorage.clear();
    navigate("/");
  }

  function selectPlaylist(id) {
    navigate(`/player?playlist=${id}`);
  }

  return (
    <div className="playlistsPage">
      <img className="cornerLogo" src={logo} alt="Vidify logo" />
      <h1>Select a playlist, {localStorage.getItem("currentUser")}</h1>
      <p className="changeLink" onClick={changeUser}>
        Change user
      </p>

      <div className="playlistsContainer">
        {playlistsData.items
          .slice()
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((playlist) => (
            <PlaylistTile
              key={playlist.id}
              id={playlist.id}
              name={playlist.name}
              art={playlist.images?.[0]?.url || ""}
              handleClick={selectPlaylist}
            />
          ))}
      </div>
    </div>
  );
}
