const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const { mapDBToModelPlaylistSong } = require("../../utils");

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
      RIGHT JOIN playlistsongs ON songs.id = playlistsongs.song_id
      WHERE playlistsongs.playlist_id = $1
      `,
      values: [playlistId],
    };

    const playlist = {
      text: `SELECT playlists.*, users.username
      FROM playlists
      INNER JOIN users ON users.id = playlists.owner
      WHERE playlists.id = $1`,
      values: [playlistId],
    };

    const hasil = await this._pool.query(playlist);
    
    const hasil2 = hasil.rows[0];
   
    const result = await this._pool.query(query);
    const result2 = result.rows;
    // const final = hasil2.push(result2);
    const final = mapDBToModelPlaylistSong(hasil2, result2)
    
    if(!hasil.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    return final;
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

  async verifySong(id) {
    const query = {
      text: 'SELECT id FROM songs WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Lagu tidak ditemukan");
    }
  }
}

module.exports = PlaylistSongService;