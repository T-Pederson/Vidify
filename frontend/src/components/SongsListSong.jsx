export default function SongsListSong({ songData }) {
  function formatMs(duration) {
    let seconds = duration / 1000;
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds - minutes * 60);
    if (seconds < 10) {
      return `${minutes}:0${seconds}`;
    } else {
      return `${minutes}:${seconds}`;
    }
  }

  return (
    <div className="songsListSong">
      <div>
        <p className="songTitle">{songData.track.name}</p>
        <p className="songArtist">{songData.track.artists[0].name}</p>
      </div>
      <p>{formatMs(songData.track.duration_ms)}</p>
    </div>
  );
}
