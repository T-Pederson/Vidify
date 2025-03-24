import SongsListSong from "./SongsListSong";

export default function SongsList({ songs }) {
  return (
    <div className="songsList">
      <div className="songsListHeader">
        <div>
          <p>Title</p>
          <p>Duration</p>
        </div>
        <hr />
      </div>
      {songs.map((song) => (
        <SongsListSong songData={song} />
      ))}
    </div>
  );
}
