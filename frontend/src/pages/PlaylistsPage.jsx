import { useEffect, useState } from "react";
import logo from "../assets/vidify-logo.svg";
import { useNavigate } from "react-router-dom";
import PlaylistTile from "../components/PlaylistTile";

export default function PlaylistsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [playlists, setPlaylists] = useState([]);

  const currentUser = localStorage.getItem("currentUser");

  useEffect(() => {
    if (!currentUser) {
      navigate("/");
      return;
    }

    fetch(`${import.meta.env.VITE_BACKEND_URL}/users/${currentUser}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setPlaylists(res.playlists);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  }, [navigate, currentUser]);

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
      <h1>Select a playlist, {currentUser}</h1>
      <p className="changeLink" onClick={changeUser}>
        Change user
      </p>

      <div className="playlistsContainer">
        {playlists.length > 0 ? (
          playlists
            .slice()
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((playlist) => (
              <PlaylistTile
                key={playlist.id}
                id={playlist.id}
                name={playlist.name}
                art={playlist.image}
                handleClick={selectPlaylist}
              />
            ))
        ) : (
          <p>No playlists found for {currentUser}</p>
        )}
      </div>
    </div>
  );
}
