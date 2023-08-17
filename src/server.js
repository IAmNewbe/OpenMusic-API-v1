require ('dotenv').config();

const Hapi = require('@hapi/hapi');
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

const init = async () => {
  const songsService = new SongsService();
  const albumsService = new AlbumsService();
  const userService = new UserService();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
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
    }
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
