const PlaylistSongsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlistsong',
  version: '1.0.0',
  register: async (server, { playlistSongService, playlistsService, validator}) => {
    const playlistSongsHandler = new PlaylistSongsHandler(
      playlistSongService, playlistsService, validator
    );
    server.route(routes(playlistSongsHandler));
  },
};