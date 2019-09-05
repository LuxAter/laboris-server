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
      hidden: args.hidden || false,
      open: true
    };
    if (_.some(body.parents, p => p === undefined)) {
      throw new Error("Unrecognized parent task");
    } else if (_.some(body.children, c => c === undefined)) {
      throw new Error("Unrecognized child task");
    }
    body.parents.forEach(id => {
      const parent = db.open().find({ id: id });
      parent
        .assign({
          children: [...parent.value().children, body.id],
          modifiedDate: body.modifiedDate
        })
        .write();
    });
    body.children.forEach(id => {
      const child = db.open().find({ id: id });
      child
        .assign({
          parents: [...child.value().parents, body.id],
          modifiedDate: body.modifiedDate
        })
        .write();
    });
    db.open()
      .push(body)
      .write();
    return new Task(body);
  },

  modifyTask: args => {
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
    const task = db.open().find({ id: args.id });
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
