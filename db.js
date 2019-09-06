const _ = require("lodash");
const low = require("lowdb");
const Fuse = require("fuse.js");
const mongodb = require("mongodb").MongoClient;
const url =
  "mongodb+srv://admin:f2W3WpXVBTWqdJP@cluster0-qtph0.mongodb.net/test?retryWrites=true&w=majority";

var connection = mongodb.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

module.exports.open = () => {
  return connection.then(client => client.db("tasks").collection("open"));
};
module.exports.closed = () => {
  return connection.then(client => client.db("tasks").collection("closed"));
};

module.exports.findById = id => {
  return this.open()
    .then(collection => collection.findOne({ _id: id }))
    .then(data => {
      if (data.length !== 0) return data;
      return this.closed().then(collection => collection.findOne({ _id: id }));
    });
};

module.exports.search = (query, open) => {
  return this.open()
    .then(collection => collection.find().toArray())
    .then(data => {
      if (query === undefined) return undefined;
      var fuse = new Fuse(data, {
        shouldSort: true,
        threshold: 0.4,
        keys: ["id", "title", "tags"]
      });
      if (Array.isArray(query)) return _.map(query, q => fuse.search(q));
      return fuse.search(query);
    });
};
