/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  // membuat user baru.
  pgm.sql("INSERT INTO users(id, username, password, fullname) VALUES ('old_playlists', 'old_playlists', 'old_playlists', 'old playlists')");

  pgm.sql("UPDATE playlists SET owner = 'old_playlists' WHERE owner = NULL");

  pgm.addConstraint("playlists", "fk_playlists.owner_users.id", "FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE");
};

exports.down = pgm => {

  pgm.dropConstraint("playlists", "fk_playlists.owner_users.id");

  pgm.sql("UPDATE playlists SET owner = NULL WHERE owner = 'old_playlists'");

  pgm.sql("DELETE FROM users WHERE id = 'old_playlists'");
};
