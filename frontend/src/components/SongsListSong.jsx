export default function SongsListSong({ songData }) {
  return (
    <div className="songsListSong">
      <div>
        <p className="songTitle">{songData.name}</p>
        <p className="songArtist">{songData.artist}</p>
      </div>
      <p>{songData.duration}</p>
    </div>
  );
}
