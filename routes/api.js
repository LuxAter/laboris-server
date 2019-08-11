const express = require("express");
const uuidv3 = require("uuid/v3");
const _ = require("lodash");
const Fuse = require("fuse.js");

var router = express.Router();

const genEntry = body =>
  _.omitBy(
    {
      _id: body.id,
      title: body.title,
      parents: body.parents ? _.castArray(body.parents) : undefined,
      children: body.children ? _.castArray(body.children) : undefined,
      tags: body.tags ? _.castArray(body.tags) : undefined,
      priority: body.priority,
      dueDate: body.dueDate,
      entryDate: body.entryDate,
      doneDate: body.doneDate,
      status: body.status,
      times: body.times ? _.castArray(body.times) : undefined,
      hidden: body.hidden,
      modifiedDate: body.time ? body.time : body.modifiedDate
    },
    _.isNil
  );

const genFilter = body => {
  return entry => {
    if (_.has(body, "status") && entry["status"] !== body["status"])
      return false;
    if (_.has(body, "tag") && -1 === _.indexOf(entry["tags"], body["tag"]))
      return false;
    if (_.has(body, "parent") && !_.has(entry["parents"], body["parent"]))
      return false;
    if (_.has(body, "child") && !_.has(entry["children"], body["child"]))
      return false;
    if (_.has(body, "time") && entry["modifiedDate"] < body["time"])
      return false;
    if (_.has(body, "due") && entry["dueDate"] > body["due"]) return false;
    if (
      _.has(body, "createdSince") &&
      entry["entryDate"] < body["createdSince"]
    )
      return false;
    if (
      _.has(body, "createdBefore") &&
      entry["entryDate"] > body["createdBefore"]
    )
      return false;
    if (
      _.has(body, "updatedSince") &&
      entry["modifiedDate"] < body["updatedSince"]
    )
      return false;
    if (
      _.has(body, "updatedBefore") &&
      entry["modifiedDate"] > body["updatedSince"]
    )
      return false;
    if (_.has(body, "dueBefore") && entry["dueDate"] > body["dueBefore"])
      return false;
    if (_.has(body, "dueAfter") && entry["dueDate"] < body["dueAfter"])
      return false;
    return true;
  };
};

router.get("/", (req, res) => {
  if (req.query.key) {
    res.json(
      req.app.db
        .get("tasks")
        .filter(genFilter(req.query))
        .map(req.query.key === "id" ? "_id" : req.query.key)
        .value()
    );
  } else {
    res.json(
      req.app.db
        .get("tasks")
        .filter(genFilter(req.query))
        .value()
    );
  }
});

router.get("/find", (req, res) => {
  var fuse = new Fuse(
    req.app.db
      .get("tasks")
      .filter(genFilter(req.query))
      .value(),
    {
      shouldSort: true,
      keys: ["title", "_id", "tags"]
    }
  );
  if (req.query.key) {
    res.json(
      _.map(
        fuse.search(req.query.query),
        req.query.key === "id" ? "_id" : req.query.key
      )
    );
  } else {
    res.json(fuse.search(req.query.query));
  }
});

router.post("/", (req, res) => {
  req.app.db
    .get("tasks")
    .push(
      _.defaults(
        {
          _id: req.body.id,
          hidden: req.body.hidden,
          title: req.body.title,
          parents: req.body.parents ? _.castArray(req.body.parents) : undefined,
          children: req.body.children
            ? _.castArray(req.body.children)
            : undefined,
          priority: req.body.priority,
          status: req.body.status,
          tags: req.body.tags ? _.castArray(req.body.tags) : undefined,
          entryDate: req.body.entryDate,
          dueDate: req.body.dueDate,
          doneDate: req.body.doneDate,
          modifiedDate: req.body.time ? req.body.time : req.body.modifiedDate,
          times: req.body.times ? _.castArray(req.body.times) : undefined
        },
        {
          _id: uuidv3(req.body.title + _.now().toString(), uuidv3.URL),
          hidden: false,
          parents: [],
          children: [],
          priority: 5,
          status: "active",
          tags: [],
          entryDate: _.now(),
          dueDate: null,
          doneDate: null,
          modifiedDate: _.now(),
          times: []
        }
      )
    )
    .write()
    .then(entry => res.json(entry));
});

router.post("/stop", (req, res) => {
  req.app.db
    .get("tasks")
    .filter(entry => {
      return entry.times.length !== 0 && _.last(entry.times).length === 1;
    })
    .each(entry => {
      entry.times = [
        ..._.dropRight(entry.times),
        [_.last(entry.times)[0], _.now()]
      ];
      entry.modifiedDate = _.now();
    })
    .write()
    .then(entries => res.json(entries));
});

router.post("/start/:uuid", (req, res) => {
  var task = req.app.db.get("tasks").find({
    _id: req.params.uuid
  });
  if (task.value() === undefined) {
    res.json({
      error: "UUID not found",
      uuid: req.params.uuid
    });
  } else if (
    task.value().times.length !== 0 &&
    _.last(task.value().times).length === 1
  ) {
    res.json({
      error: "UUID is already active",
      uuid: req.params.uuid
    });
  } else {
    task
      .assign({
        modifiedDate: _.now(),
        times: [
          ...task.value().times,
          [req.body.time ? _.toInteger(req.body.time) : _.now()]
        ]
      })
      .write()
      .then(entry => res.json(entry));
  }
});

router.post("/stop/:uuid", (req, res) => {
  var task = req.app.db.get("tasks").find({
    _id: req.params.uuid
  });
  if (task.value() === undefined) {
    res.json({
      error: "UUID not found",
      uuid: req.params.uuid
    });
  } else if (
    task.value().times.length === 0 ||
    _.last(task.value().times).length !== 1
  ) {
    res.json({
      error: "UUID is not active",
      uuid: req.params.uuid
    });
  } else {
    task
      .assign({
        modifiedDate: _.now(),
        times: [
          ..._.dropRight(task.value().times),
          [
            _.last(task.value().times)[0],
            req.body.time ? _.toInteger(req.body.time) : _.now()
          ]
        ]
      })
      .write()
      .then(entry => res.json(entry));
  }
});

module.exports = router;