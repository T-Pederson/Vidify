import { Link } from "react-router-dom";

export default function ErrorPage() {
  return (
    <div className="errorPage">
      <h1>
        404 page not found, <Link to="/">click here to go home</Link>
      </h1>
    </div>
  );
}
