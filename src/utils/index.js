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

module.exports = { mapDBToModel , mapDBToModelAlbum };