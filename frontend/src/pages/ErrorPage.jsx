import { Link } from "react-router-dom";

export default function ErrorPage() {
  return (
    <div>
      <h1>Oops wrong page, <Link to={'/'}>click here to go home</Link></h1>
    </div>
  );
}
