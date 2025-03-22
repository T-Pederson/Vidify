import { Routes, Route } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage";
import LandingPage from "./pages/LandingPage";
import PlaylistsPage from "./pages/PlaylistsPage";
import "./App.css";
import PlayerPage from "./pages/PlayerPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="*" element={<ErrorPage />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/playlists" element={<PlaylistsPage />} />
        <Route path="/player" element={<PlayerPage />} />
      </Routes>
    </>
  );
}

export default App;
