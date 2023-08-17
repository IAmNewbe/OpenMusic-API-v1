/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.addColumn("playlists", {
    owner: {
      type: "VARCHAR(50)",
    },
  });
};

exports.down = pgm => {
  pgm.dropColumn("playlists", "owner");
};
