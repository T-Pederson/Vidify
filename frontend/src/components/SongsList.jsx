import SongsListSong from "./SongsListSong";
import songsData from "../pages/songs.json";

export default function SongsList({ playlistData }) {
  return (
    <div className="songsList">
      <div className="songsListHeader">
        <div>
          <p>Title</p>
          <p>Duration</p>
        </div>
        <hr />
      </div>
      {songsData.items.map((song) => (
        <SongsListSong songData={song} />
      ))}
    </div>
  );
}
