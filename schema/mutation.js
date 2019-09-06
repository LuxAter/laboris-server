const _ = require("lodash");
const Fuse = require("fuse.js");
const uuidv3 = require("uuid/v3");

const db = require("../db.js");
const { Task } = require("./task.js");

const getTask = id => {
  var task = db.open().find({ id: id });
  if (task.value()) return task;
  else return db.closed().find({ id: id });
};

module.exports.mutationSchema = `
  type Mutation {
    newTask(title: String!, parents: [String], children: [String], tags: [String], priority: Int, dueDate: BigInt, hidden: Boolean): Task
    modifyTask(id: String!, title: String, parents: [String], children: [String], tags: [String], priority: Int, dueDate: BigInt, hidden: Boolean): Task
    start(id: String!, startTime: BigInt): Task
    stop(id: String!, stopTime: BigInt): Task
    close(id: String!): Task
    reopen(id: String!): Task
    delete(id: String!): String!
  }
`;

module.exports.mutationRoot = {
  newTask: args => {
    var body = {
      _id: uuidv3(args.title + _.now().toString(), uuidv3.URL),
      title: args.title,
      parents: args.parents || [],
      children: args.children || [],
      tags: args.tags || [],
      priority: args.priority || 5,
      entryDate: _.now(),
      dueDate: args.dueDate || null,
      doneDate: null,
      modifiedDate: _.now(),
      times: [],
      hidden: args.hidden || false
    };
    return db
      .search(body.parents)
      .then(res => {
        if (_.some(res, p => p.length === 0))
          throw new Error("Unrecognized parent task");
        body.parents = _.map(res, o => o[0]._id);
        body.parents.forEach(parentId =>
          db.open().then(collection => {
            collection.updateOne(
              { _id: parentId },
              { $addToSet: { children: body._id } }
            );
          })
        );
        return db.search(body.children);
      })
      .then(res => {
        if (_.some(res, p => p.length === 0))
          throw new Error("Unrecognized child task");
        body.children = _.map(res, o => o[0]._id);
        body.children.forEach(childId =>
          db.open().then(collection => {
            collection.updateOne(
              { _id: childId },
              { $addToSet: { parents: body._id } }
            );
          })
        );
      })
      .then(() => db.open())
      .then(collection => collection.insertOne(body))
      .then(res => new Task(body));
  },

  modifyTask: args => {
    return db.open().then(collection => collection.findOne({ _id: args.id }));
    const task = db.open().find({ id: args.id });
    if (!task.value()) throw new Error(`No matching ID for \"${args.id}\"`);
    const taskValue = task.value();
    if (args.parents !== undefined) {
      taskValue.parents.forEach(id => {
        var parent = getTask(id);
        if (parent.value())
          parent.assign({
            children: _.filter(parent.value().children, str => str != task.id)
          });
      });
      args.parents.forEach(id => {
        var prent = getTask(id);
        if (parent.value())
          parent.assign({
            children: [...parent.value().children, task.id],
            modifiedDate: _.now()
          });
      });
    }
    if (args.children !== undefined) {
      taskValue.children.forEach(id => {
        var child = getTask(id);
        if (child.value())
          child.assign({
            parents: _.filter(child.value().parents, str => str != task.id)
          });
      });
      args.children.forEach(id => {
        var child = getTask(id);
        if (child.value())
          child.assign({
            parents: [...child.value().parents, task.id],
            modifiedDate: _.now()
          });
      });
    }
    return new Task(
      db
        .open()
        .find({ id: args.id })
        .assign({ ...args, modifiedDate: _.now() })
        .write()
    );
  },

  start: args => {
    return db
      .open()
      .then(collection => collection.findOne({ _id: args.id }))
      .then(task => {
        if (task === undefined)
          throw new Error(`No matching ID for \"${args.id}\"`);
        if (task.times.length !== 0 && _.last(task.times).length === 1)
          throw new Error(`Task \"${args.id}\" is already active`);
        return db.open();
      })
      .then(collection =>
        collection.findOneAndUpdate(
          { _id: args.id },
          { $push: { times: [_.now()] } },
          { returnNewDocument: true }
        )
      )
      .then(res => new Task(res.value));
  },

  stop: args => {
    const task = db.open().find({ id: args.id });
    if (!task.value()) throw new Error(`No matching ID for \"${args.id}\"`);
    if (
      task.value().times.length === 0 ||
      _.last(task.value().times).length !== 1
    )
      throw new Error(`Task \"${args.id}\" is not active`);
    return new Task(
      task
        .assign({
          modifiedDate: _.now(),
          times: [
            ..._.dropRight(task.value().times),
            [_.last(task.value().times)[0], args.stopTime || _.now()]
          ]
        })
        .write()
    );
  },

  close: args => {
    const task = db
      .open()
      .find({ id: args.id })
      .value();
    if (!task) throw new Error(`No matching ID for \"${args.id}\"`);
    db.open()
      .remove({ id: args.id })
      .write();
    db.closed()
      .push(task)
      .write();
    return new Task(
      db
        .closed()
        .find({ id: args.id })
        .assign({ modifiedDate: _.now(), doneDate: _.now(), open: false })
        .write()
    );
  },
  reopen: args => {
    const task = db
      .closed()
      .find({ id: args.id })
      .value();
    if (!task) throw new Error(`No matching ID for \"${args.id}\"`);
    db.closed()
      .remove({ id: args.id })
      .write();
    db.open()
      .push(task)
      .write();
    return new Task(
      db
        .open()
        .find({ id: args.id })
        .assign({ modifiedDate: _.now(), doneDate: null, open: true })
        .write()
    );
  },

  delete: args => {
    const task = db
      .open()
      .find({ id: args.id })
      .value();
    if (!task) throw new Error(`No matching ID for \"${args.id}\"`);
    db.open()
      .remove({ id: args.id })
      .write();
    task.parents.forEach(id => {
      var parent = getTask(id);
      if (parent.value()) {
        parent.assign({
          children: _.filter(parent.value().children, str => str != task.id)
        });
      }
    });
    task.children.forEach(id => {
      var child = getTask(id);
      if (child.value()) {
        child.assign({
          parents: _.filter(child.value().parents, str => str != task.id)
        });
      }
    });
    return args.id;
  }
};
