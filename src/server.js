require ('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const songs = require('./api/songs');
const albums = require('./api/albums');
const SongsValidator = require('./validator/songs/SongIndex');
const AlbumsService = require('./services/postgres/AlbumsServices');
const AlbumsValidator = require('./validator/albums/AlbumIndex');
const SongsService = require('./services/postgres/SongsService');

//users
const users = require('./api/users');
const UserService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');

//Authentications
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');

//Playlists
const playlists = require('./api/playlists');
const PlaylistsService = require('./services/postgres/PlaylistsService');
const PlaylistsValidator = require('./validator/playlists');

//PlaylistSong
const playlistsong = require('./api/playlistsong');
const PlaylistSongService = require('./services/postgres/PlaylistsSongsService');
const PlaylistSongValidator = require('./validator/playlistssongs');

const init = async () => {
  const songsService = new SongsService();
  const albumsService = new AlbumsService();
  const userService = new UserService();
  const authenticationsService = new AuthenticationsService();
  const playlistsService = new PlaylistsService();
  const playlistSongService = new PlaylistSongService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // registrasi plugin eksternal
  await server.register([
    {
      plugin: Jwt,
    },
  ]);
   // mendefinisikan strategy autentikasi jwt
   server.auth.strategy('songsapp_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
    {
      plugin: albums,
      options: {
        service: albumsService,
        validator: AlbumsValidator,
      }
    },
    {
      plugin: users,
      options: {
        service: userService,
        validator: UsersValidator,
      }
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        userService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      }
    },
    {
      plugin: playlists,
      options: {
        playlistsService,
        userService,
        validator: PlaylistsValidator,
      }
    },
    {
      plugin: playlistsong,
      options: {
        playlistSongService,
        playlistsService,
        validator: PlaylistSongValidator,
      }
    }
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
