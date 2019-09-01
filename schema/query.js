const _ = require("lodash");
const Fuse = require("fuse.js");
const db = require("../db.js");

const { Task } = require("./task.js");

module.exports.querySchema = `
  type Query {
    open: [Task!]!
    completed: [Task!]!
    find(query: String!): [Task!]
    get(id: String!): Task!
    filter(id: String, title: String, parents: [String], children: [String], tags: [String], priority: Int, entryBefore: BigInt, entryAfter: BigInt, dueBefore: BigInt, dueAfter: BigInt, modifiedBefore: BigInt, modifiedAfter: BigInt, hidden: Boolean): [Task!]!
  }
`;

module.exports.queryRoot = {
  open: () => {
    return _.map(db.get("open").value(), el => new Task(el));
  },
  completed: () => {
    return _.map(db.get("completed").value(), el => new Task(el));
  },

  find: ({ query }) => {
    return _.flatten(_.map(db.search(query), res => new Task(res)));
  },

  get: args => {
    const task = db
      .get("open")
      .find({ id: args.id })
      .value();
    if (!task) throw new Error(`No matching ID for \"${args.id}\"`);
    return new Task(task);
  },

  filter: ({
    id,
    title,
    parents,
    children,
    tags,
    priority,
    entryBefore,
    entryAfter,
    dueBefore,
    dueAfter,
    modifiedBefore,
    modifiedAfter,
    hidden
  }) => {
    if (hidden === undefined) hidden = false;
    parents = _.filter(
      _.map(parents, parent => {
        const res = db.search(parent);
        if (res.length !== 0) return res[0].id;
        else return undefined;
      }),
      o => o !== undefined
    );
    children = _.filter(
      _.map(children, child => {
        const res = db.search(child);
        if (res.length !== 0) return res[0].id;
        else return undefined;
      }),
      o => o !== undefined
    );
    return _.map(
      db
        .get("open")
        .filter(o => {
          if (id && !o.id.startsWith(id)) return false;
          else if (title && o.title !== title) return false;
          else if (
            parents &&
            !_.every(_.map(parents, parent => _.includes(o.parents, parent)))
          )
            return false;
          else if (
            children &&
            !_.every(_.map(children, child => _.includes(o.children, parent)))
          )
            return false;
          else if (
            tags &&
            !_.every(_.map(tags, tag => _.includes(o.tags, tag)))
          )
            return false;
          else if (priority && o.priority !== priority) return false;
          else if (entryBefore && o.entryDate > entryBefore) return false;
          else if (entryAfter && o.entryDate < entryAfter) return false;
          else if (dueBefore && (!o.dueDate || o.dueDate > dueBefore))
            return false;
          else if (dueAfter && (!o.dueDate || o.dueDate < dueAfter))
            return false;
          else if (modifiedBefore && o.modifiedDate > modifiedBefore)
            return false;
          else if (modifiedAfter && o.modifiedDate < modifiedAfter)
            return false;
          else if (hidden !== undefined && o.hidden !== hidden) return false;
          return true;
        })
        .value(),
      o => new Task(o)
    );
  }
};
