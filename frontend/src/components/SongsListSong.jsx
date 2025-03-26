export default function SongsListSong({ songData, selectSong, currentSongId }) {
  return (
    <div
      className={
        songData.id === currentSongId
          ? "songsListSong songSelected"
          : "songsListSong"
      }
      id={songData.id}
      onClick={selectSong}
    >
      <div>
        <p className="songTitle">{songData.title}</p>
        <p className="songArtist">{songData.artist}</p>
      </div>
      <p>{songData.duration}</p>
    </div>
  );
}
