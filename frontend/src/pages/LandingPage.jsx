import logo from "../assets/vidify-logo.svg";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  // call this in useEffect?
  if (localStorage.getItem("username")) {
    navigate("/playlists");
  }

  function submitUsername(e) {
    e.preventDefault();

    if (e.target.elements.username.value.length === 0) {
      return;
    }
    // check if playlists are returned when calling spotify api with given username (call to backend)
    // if valid
    // store username in local storage
    // get playlist page
    // else
    // display error to user stating no playlists found for user along with a tip on how to find their spotify username

    localStorage.setItem("currentUser", e.target.elements.username.value);
    navigate("/playlists");
  }

  return (
    <div className="landingPage">
      <img src={logo} alt="Vidify logo" />
      <h1>Enter your Spotify username to start watching</h1>
      <form onSubmit={(e) => submitUsername(e)}>
        <input type="text" name="username" autoFocus />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
