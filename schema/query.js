const _ = require("lodash");
const Fuse = require("fuse.js");
const db = require("../db.js");

const { Task } = require("./task.js");

module.exports.querySchema = `
  type Query {
    open: [Task!]!
    completed: [Task!]!
    find(query: [String]!): [[Task!]]
    filter(id: String, title: String, parents: [String], children: [String], tags: [String], priority: Int, entryBefore: Int, entryAfter: Int, dueBefore: Int, dueAfter: Int, modifiedBefore: Int, modifiedAfter: Int, hidden: Boolean): [Task!]!
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
    return _.map(query, term => _.map(db.search(term), res => new Task(res)));
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
    return db
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
        else if (tags && !_.every(_.map(tags, tag => _.includes(o.tags, tag))))
          return false;
        else if (priority && o.priority !== priority) return false;
        else if (entryBefore && o.entryDate > entryBefore) return false;
        else if (entryAfter && o.entryDate < entryAfter) return false;
        else if (dueBefore && o.dueDate && o.dueDate > dueBefore) return false;
        else if (dueAfter && o.dueDate && o.dueDate < dueAfter) return false;
        else if (modifiedBefore && o.modifiedDate > modifiedBefore)
          return false;
        else if (modifiedAfter && o.modifiedDate < modifiedAfter) return false;
        return true;
      })
      .value();
  }
};
