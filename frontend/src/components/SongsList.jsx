import SongsListSong from "./SongsListSong";

export default function SongsList({ songs, selectSong, currentSongId }) {
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
        <SongsListSong key={song.id} songData={song} selectSong={selectSong} currentSongId={currentSongId}/>
      ))}
    </div>
  );
}
