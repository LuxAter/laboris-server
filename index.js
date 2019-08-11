const express = require("express");
const low = require("lowdb");
const FileAsync = require("lowdb/adapters/FileAsync");

const log = require("./logger.js");

const apiRouter = require("./routes/api.js");

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(
  express.urlencoded({
    extended: false
  })
);

const adapter = new FileAsync("db.json", {
  serialize: obj => JSON.stringify(obj),
  deserialize: data => JSON.parse(data)
});
low(adapter)
  .then(db => {
    app.db = db;

    app.get("/", (req, res) => {
      res.json(req.app.db.get("tasks").value());
    });
    app.use("/api/", apiRouter);

    return db
      .defaults({
        tasks: []
      })
      .write();
  })
  .then(() => {
    app.listen(port);
    log.express("Listening on port {port}", {
      port: port
    });
  });
