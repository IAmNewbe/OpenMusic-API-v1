const InvariantError = require("../../exceptions/InvariantError");
const { PlaylistSongPayloadSchema } = require("./schema");

const PlaylistSongValidator = {
  validatePlaylistSongPayload: (payload) => {
    const validationResult = PlaylistSongPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PlaylistSongValidator;
