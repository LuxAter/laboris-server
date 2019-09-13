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
    var oldParents, oldChildren;
    return db
      .search(args.parents)
      .then(res => {
        if (_.some(res, p => p.length === 0))
          throw new Error("Unrecognized parent task");
        args.parents = _.map(res, o => o[0]._id);
        if (args.parents.length === 0) args.parents = undefined;
        return db.search(args.children);
      })
      .then(res => {
        if (_.some(res, p => p.length === 0))
          throw new Error("Unrecognized child task");
        args.children = _.map(res, o => o[0]._id);
        if (args.children.length === 0) args.children = undefined;
        return db.open();
      })
      .then(collection => collection.findOne({ _id: args.id }))
      .then(task => {
        if (args.parents !== undefined) {
          task.parents.forEach(parentId =>
            db.open().then(collection => {
              collection.updateOne(
                { _id: parentId },
                { $pull: { children: task._id } }
              );
            })
          );
          args.parents.forEach(parentId =>
            db.open().then(collection => {
              collection.updateOne(
                { _id: parentId },
                { $addToSet: { children: task._id } }
              );
            })
          );
        }
        oldParents = task.parents;
        if (args.children !== undefined) {
          task.children.forEach(childId =>
            db.open().then(collection => {
              collection.updateOne(
                { _id: childId },
                { $pull: { parents: task._id } }
              );
            })
          );
          args.children.forEach(childId =>
            db.open().then(collection => {
              collection.updateOne(
                { _id: childId },
                { $addToSet: { parents: task._id } }
              );
            })
          );
        }
        oldChildren = task.children;
        return db.open();
      })
      .then(collection => {
        if (!"parents" in args) args.parents = oldParents;
        if (!"children" in args) args.children = oldChildren;
        return collection.findOneAndUpdate(
          { _id: args.id },
          { $set: { ...args, modifiedDate: _.now() } },
          { returnNewDocument: true }
        );
      })
      .then(res => new Task(res.value));
  },

  start: args => {
    return db
      .open()
      .then(collection => collection.findOne({ _id: args.id }))
      .then(task => {
        if (task === undefined || task === null)
          throw new Error(`No matching ID for \"${args.id}\"`);
        if (task.times.length !== 0 && _.last(task.times).length === 1)
          throw new Error(`Task \"${args.id}\" is already active`);
        return db.open();
      })
      .then(collection =>
        collection.findOneAndUpdate(
          { _id: args.id },
          {
            $set: { modifiedDate: _.now() },
            $push: { times: [args.startTime || _.now()] }
          },
          { returnNewDocument: true }
        )
      )
      .then(res => new Task(res.value));
  },

  stop: args => {
    var timeId = "";
    return db
      .open()
      .then(collection => collection.findOne({ _id: args.id }))
      .then(task => {
        if (task === undefined)
          throw new Error(`No matching ID for \"${args.id}\"`);
        if (task.times.length === 0 || _.last(task.times).length !== 1)
          throw new Error(`Task \"${args.id}\" is not active`);
        timeId = `times.${task.times.length - 1}`;
        return db.open();
      })
      .then(collection => {
        var updateData = { $set: { modifiedDate: _.now() }, $push: {} };
        updateData.$push[timeId] = args.stopTime || _.now();
        return collection.findOneAndUpdate({ _id: args.id }, updateData, {
          returnOriginal: false
        });
      })
      .then(res => new Task(res.value));
  },

  close: args => {
    var task = undefined;
    return db
      .open()
      .then(collection =>
        collection.findOneAndUpdate(
          { _id: args.id },
          { $set: { modifiedDate: _.now(), doneDate: _.now() } },
          { returnOriginal: false }
        )
      )
      .then(res => {
        task = res.value;
        return db.closed();
      })
      .then(collection => collection.insertOne(task))
      .then(res => db.open())
      .then(collection => collection.deleteOne({ _id: args.id }))
      .then(res => new Task(task));
  },
  reopen: args => {
    var task = undefined;
    return db
      .closed()
      .then(collection =>
        collection.findOneAndUpdate(
          { _id: args.id },
          { $set: { modifiedDate: _.now(), doneDate: null } },
          { returnOriginal: false }
        )
      )
      .then(res => {
        task = res.value;
        return db.open();
      })
      .then(collection => collection.insertOne(task))
      .then(res => db.closed())
      .then(collection => collection.deleteOne({ _id: args.id }))
      .then(res => new Task(task));
  },

  delete: args => {
    return db
      .open()
      .then(collection => collection.findOne({ _id: args.id }))
      .then(task => {
        task.parents.forEach(parentId =>
          db.open().then(collection => {
            collection.updateOne(
              { _id: parentId },
              { $pull: { children: task._id } }
            );
          })
        );
        task.children.forEach(childId =>
          db.open().then(collection => {
            collection.updateOne(
              { _id: childId },
              { $pull: { parents: task._id } }
            );
          })
        );
        return db.open();
      })
      .then(collection => collection.deleteOne({ _id: args.id }))
      .then(res => args.id);
  }
};
