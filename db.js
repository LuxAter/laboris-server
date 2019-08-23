const _ = require("lodash");
const low = require("lowdb");
const Fuse = require("fuse.js");
const FileAsync = require("lowdb/adapters/FileSync");
const adapter = new FileAsync("db.json", {
  serialize: obj => JSON.stringify(obj),
  deserialize: data => JSON.parse(data)
});
const db = low(adapter);
module.exports = db;

module.exports.search = query => {
  var fuse = new Fuse(db.get("open").value(), {
    shouldSort: true,
    keys: ["id", "title", "tags"]
  });
  return fuse.search(query);
};
