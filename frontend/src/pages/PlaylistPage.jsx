import logo from "../assets/vidify-logo.svg";
import { useNavigate } from "react-router-dom";

export default function PlaylistPage() {
  const navigate = useNavigate();

  // call this in useEffect?
  if (!localStorage.getItem("currentUser")) {
    navigate("/");
  }

  return (
    <div className="playlistPage">
      <img src={logo} alt="Vidify logo" />
      <h1>Select a playlist, {localStorage.getItem("currentUser")}</h1>
    </div>
  );
}
