const mapDBToModel = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  album_id,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId: album_id,
});

const mapDBToModelAlbum = ({ id, name, year }) => ({
  id,
  name,
  year,
});

const mapDBToModelPlaylist = ({ id, name, username }) => ({
  id,
  name,
  username,
});

const mapDBToModelPlaylistSong = ({ id, name, username }, songs) => ({
  id,
  name, 
  username,
  songs,
});

module.exports = { mapDBToModel , mapDBToModelAlbum, mapDBToModelPlaylist, mapDBToModelPlaylistSong };