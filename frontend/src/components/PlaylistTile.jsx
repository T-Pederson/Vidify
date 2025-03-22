export default function PlaylistTile({ id, name, art, handleClick}) {
  return (
    <div className="playlistTile" onClick={() => (handleClick(id))}>
      <img src={art} alt={`${name} playlist artwork`} />
      <p>{name}</p>
    </div>
  )
}