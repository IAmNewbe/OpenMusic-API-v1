const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

class PlaylistSongService {
  constructor() {
    this._pool = new Pool();
  }

  async addSongToPlaylistSong(songId, playlistId) {
    const id = `playlistsong-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlistsongs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }
  }

  async getSongFromPlaylistSong(playlistId) {
    const query = {
      text: `SELECT songs.id, songs.title, songs.performer FROM songs
      LEFT JOIN playlistsongs ON songs.id = playlistsongs.song_id
      WHERE playlistsongs.playlist_id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    if(!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    console.log(result.rows);
    return result.rows;
  }

  async deleteSongFromPlaylistSong(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlistsongs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Lagu gagal dihapus');
    }
  }
}

module.exports = PlaylistSongService;