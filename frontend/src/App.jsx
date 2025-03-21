import { Routes, Route } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage";
import LandingPage from "./pages/LandingPage";
import PlaylistPage from "./pages/PlaylistPage";
import "./App.css";

function App() {
  return (
    <>
      <Routes>
        <Route path="*" element={<ErrorPage />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/playlists" element={<PlaylistPage />} />
      </Routes>
    </>
  );
}

export default App;
