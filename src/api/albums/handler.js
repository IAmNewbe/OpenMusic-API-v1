const ClientError = require("../../exceptions/ClientError");

class AlbumHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
  }

  async postAlbumHandler(){
    try {
      this._validator.validate(request.payload);
      const { name, year } = request.payload;

      const albumId= await this._service.addAlbum({ name, year });

      const response = h.response({
        status: 'success',
        data: {
          albumId,
        },
      });
      response.code(201);
      return response;
    } catch (err) {
      if (err instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: err.message,
        });
        response.code(err.statusCode);
        return response;
      }

      //server error 
      const response = h.response({
        status: 'error',
        message: err.message,
      });
      response.code(500);
      return response;
    }
  }

  async getAlbumByIdHandler(request, h) {
    try{
      const { id } = request.params;
      const album = await this._service.getAlbumById(id);
      return {
        status: 'success',
        data: {
          album,
        },
      };
    } catch (err) {
      if (err instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: err.message,
        });
        response.code(err.statusCode);
        return response;
      }

      //server error
      const response = h.response({
        status: 'error',
        message: 'server error',
      });
      response.code(500);
      return response;
    }
  }

  async putAlbumByIdHandler(request, h) {
    try {
      this._validator.validateAlbumPayload(request.payload);
      const { id } = request.params;

      await this._service.editAlbumById(id, request.payload);

      return {
        status: 'success',
        message: 'Albumm berhasil diperbarui',
      };
    } catch (err) {
      if ( err instanceof ClientError ) {
        const response = h.response({
          status: 'fail',
          message: err.message,
        });
        response.code(err.statusCode);
        return response;
      }

      //server error
      const response = h.response({
        statusbar: 'error',
        message: 'server error',
      });
      response.code(500);
      return response;
    }
  }

  async deleteAlbumByIdHandler() {
    try {
      const { id } = request.params;
      await this._service.deleteAlbumById(id);

      return {
        status: 'success',
        message: 'Album deleted successfully',
      };
    } catch (err) {
      if (err instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: err.message,
        });
        response.code(err.statusCode);
        return response;
      }

      //server error
      const response = h.response({
        status: 'error',
        message: 'server error',
      });
      response.code(500);
      return response;
    }
  }
}

module.exports = AlbumHandler;