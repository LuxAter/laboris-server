const _ = require("lodash");
const low = require("lowdb");
const Fuse = require("fuse.js");
const FileAsync = require("lowdb/adapters/FileSync");
const adapter = new FileAsync("db.json", {
  serialize: obj => JSON.stringify(obj),
  deserialize: data => JSON.parse(data)
});
const lowdb = low(adapter);
lowdb.defaults({ open: [], closed: [] }).write();

class Query {
  constructor(data) {
    this.query = lowdb.get(data);
  }
  find(query) {
    this.query = this.query.find(query);
    return this;
  }
  filter(cond) {
    this.query = this.query.filter(cond);
    return this;
  }
  assign(data) {
    this.query = this.query.assign(data);
    return this;
  }
  push(data) {
    this.query = this.query.push(data);
    return this;
  }
  remove(query) {
    this.query = this.query.remmove(query);
    return this;
  }
  write() {
    return this.query.write();
  }
  value() {
    return this.query.value();
  }
}

module.exports.open = () => {
  return new Query("open");
};

module.exports.closed = () => {
  return new Query("open");
};

module.exports.search = (query, open) => {
  const data = open
    ? this.open().value()
    : _.concat(this.open().value(), this.closed().value());
  var fuse = new Fuse(data, {
    shouldSort: true,
    threshold: 0.4,
    keys: ["id", "title", "tags"]
  });
  return fuse.search(query);
};
