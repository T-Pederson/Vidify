import { useEffect, useState } from "react";
import logo from "../assets/vidify-logo.svg";
import { useNavigate, Link } from "react-router-dom";
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
    return <p className="loading">Loading...</p>;
  }

  return (
    <div className="playlistsPage">
      <header>
        <img className="cornerLogo" src={logo} alt="Vidify logo" />
        <h1>Select a playlist, {currentUser}</h1>
        <Link onClick={() => localStorage.clear()} to="/">
          Change user
        </Link>
      </header>
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
                handleClick={() => navigate(`/player?playlist=${playlist.id}`)}
              />
            ))
        ) : (
          <p>No playlists found for {currentUser}</p>
        )}
      </div>
    </div>
  );
}
