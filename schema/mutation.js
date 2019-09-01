const _ = require("lodash");
const Fuse = require("fuse.js");
const uuidv3 = require("uuid/v3");

const db = require("../db.js");
const { Task } = require("./task.js");

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
      id: uuidv3(args.title + _.now().toString(), uuidv3.URL),
      title: args.title,
      parents: _.map(args.parents, parent => {
        const res = db.search(parent);
        if (res.length !== 0) return res[0].id;
        else return undefined;
      }),
      children: _.map(args.children, child => {
        const res = db.search(child);
        if (res.length !== 0) return res[0].id;
        else return undefined;
      }),
      tags: args.tags || [],
      priority: args.priority || 5,
      entryDate: _.now(),
      dueDate: args.dueDate || null,
      doneDate: null,
      modifiedDate: _.now(),
      times: [],
      hidden: args.hidden || false
    };
    if (_.some(body.parents, p => p === undefined)) {
      throw new Error("Unrecognized parent task");
    } else if (_.some(body.children, c => c === undefined)) {
      throw new Error("Unrecognized child task");
    }
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
    db.get("open")
      .push(body)
      .write();
    return new Task(body);
  },

  modifyTask: args => {
    // TODO Update parent/children tasks appropriatly.
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
    if (!task.value()) throw new Error(`No matching ID for \"${args.id}\"`);
    if (
      task.value().times.length !== 0 &&
      _.last(task.value().times).length === 1
    )
      throw new Error(`Task \"${args.id}\" is already active`);
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
      .get("open")
      .find({ id: args.id })
      .value();
    if (!task) throw new Error(`No matching ID for \"${args.id}\"`);
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
    if (!task) throw new Error(`No matching ID for \"${args.id}\"`);
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
    const task = db
      .get("open")
      .find({ id: args.id })
      .value();
    if (!task) throw new Error(`No matching ID for \"${args.id}\"`);
    db.get("open")
      .remove({ id: args.id })
      .write();
    task.parents.forEach(id => {
      var parent = db.get("open").find({ id: id });
      if (parent.value()) {
        parent.assign({
          children: _.filter(parent.value().children, str => str != task.id)
        });
      }
    });
    task.children.forEach(id => {
      var child = db.get("open").find({ id: id });
      if (child.value()) {
        child.assign({
          parents: _.filter(child.value().parents, str => str != task.id)
        });
      }
    });
    return args.id;
  }
};
