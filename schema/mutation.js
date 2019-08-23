const _ = require("lodash");
const Fuse = require("fuse.js");
const uuidv3 = require("uuid/v3");

const db = require("../db.js");
const { Task } = require("./task.js");

module.exports.mutationSchema = `
  type Mutation {
    newTask(title: String!, parents: [String], children: [String], tags: [String], priority: Int!, dueDate: Int, hidden: Boolean): Task
    modifyTask(id: String!, title: String, parents: [String], children: [String], tags: [String], priority: Int, dueDate: Int, hidden: Boolean): Task
    start(id: String!, startTime: Int): Task
    stop(id: String!, stopTime: Int): Task
    close(id: String!): Task
    reopen(id: String!): Task
    delete(id: String!): Boolean!
  }
`;

module.exports.mutationRoot = {
  newTask: args => {
    var body = {
      id: uuidv3(args.title + _.now().toString(), uuidv3.URL),
      title: args.title,
      parents: _.map(args.parents, parent => db.search(parent)[0].id),
      children: _.map(args.children, child => db.search(child)[0].id),
      tags: args.tags || [],
      priority: args.priority,
      entryDate: _.now(),
      dueDate: args.dueDate,
      doneDate: null,
      modifiedDate: _.now(),
      times: [],
      hidden: args.hidden || false
    };
    db.get("open")
      .push(body)
      .write();
    body.parents.forEach(id => {
      const parent = db.get("open").find({ id: id });
      parent
        .assign({
          children: [...parent.value().children, body.id],
          modifiedDate: body.modifiedDate
        })
        .write();
    });
    body.children.forEach(id => {
      const child = db.get("open").find({ id: id });
      child
        .assign({
          parents: [...child.value().parents, body.id],
          modifiedDate: body.modifiedDate
        })
        .write();
    });
    return new Task(body);
  },

  modifyTask: args => {
    return new Task(
      db
        .get("open")
        .find({ id: args.id })
        .assign({ ...args, modifiedDate: _.now() })
        .write()
    );
  },

  start: args => {
    const task = db.get("open").find({ id: args.id });
    if (!task.value()) throw new Error("no matching ID");
    if (
      task.value().times.length !== 0 &&
      _.last(task.value().times).length === 1
    )
      throw new Error("task is already active");
    return new Task(
      task
        .assign({
          modifiedDate: _.now(),
          times: [...task.value().times, [args.startTime || _.now()]]
        })
        .write()
    );
  },

  stop: args => {
    const task = db.get("open").find({ id: args.id });
    if (!task.value()) throw new Error("no matching ID");
    if (
      task.value().times.length === 0 ||
      _.last(task.value().times).length !== 1
    )
      throw new Error("task is not active");
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
      .get("open")
      .find({ id: args.id })
      .value();
    if (!task) throw new Error("no matching ID");
    db.get("open")
      .remove({ id: args.id })
      .write();
    return new Task(
      db
        .get("closed")
        .push(task)
        .write()
    );
  },
  reopen: args => {
    const task = db
      .get("closed")
      .find({ id: args.id })
      .value();
    if (!task) throw new Error("no matching ID");
    db.get("closed")
      .remove({ id: args.id })
      .write();
    return new Task(
      db
        .get("open")
        .push(task)
        .write()
    );
  },

  delete: args => {
    const task = db.get("open").find({ id: args.id });
    if (!task.value()) return false;
    db.get("open")
      .remove({ id: args.id })
      .write();
    return true;
  }
};
