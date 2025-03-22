import SongsListSong from "./SongsListSong";

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
      <SongsListSong />
      <SongsListSong />
      <SongsListSong />
      <SongsListSong />
      <SongsListSong />
      <SongsListSong />
      <SongsListSong />
      <SongsListSong />
      <SongsListSong />
      <SongsListSong />
      <SongsListSong />
      <SongsListSong />
      <SongsListSong />
      <SongsListSong />
      <SongsListSong />
    </div>
  );
}
