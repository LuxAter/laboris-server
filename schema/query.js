const _ = require("lodash");
const Fuse = require("fuse.js");
const db = require("../db.js");

const { Task } = require("./task.js");

module.exports.querySchema = `
  type Query {
    open: [Task!]!
    closed: [Task!]!
    find(query: String!, open: Boolean): [Task!]
    get(id: String!): Task!
    filter(id: String, title: String, parents: [String], children: [String], tags: [String], priority: Int, entryBefore: BigInt, entryAfter: BigInt, dueBefore: BigInt, dueAfter: BigInt, modifiedBefore: BigInt, modifiedAfter: BigInt, hidden: Boolean): [Task!]!
    filterClosed(id: String, title: String, parents: [String], children: [String], tags: [String], priority: Int, entryBefore: BigInt, entryAfter: BigInt, dueBefore: BigInt, dueAfter: BigInt, modifiedBefore: BigInt, modifiedAfter: BigInt, hidden: Boolean): [Task!]!
  }
`;

module.exports.queryRoot = {
  open: () => {
    return db.open().then(collection =>
      collection
        .find()
        .toArray()
        .then(data => _.map(data, el => new Task(el)))
    );
  },
  closed: () => {
    return db.closed().then(collection =>
      collection
        .find()
        .toArray()
        .then(data => _.map(data, el => new Task(el)))
    );
    return _.map(db.closed(), el => new Task(el));
  },

  find: ({ query, open }) => {
    return db.search(query, open === undefined ? true : open).then(data => {
      return _.flatten(_.map(data, o => new Task(o)));
    });
  },

  get: args => {
    return db
      .open()
      .then(collection => collection.findOne({ _id: args.id }))
      .then(data => {
        if (data) return new Task(data);
        throw new Error(`No matching ID for ${args.id}`);
      });
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
    return db
      .search(parents)
      .then(res => {
        parents = _.map(_.filter(res, o => o !== undefined), o => o[0]._id);
        if (parents.length === 0) parents = undefined;
        return db.search(children);
      })
      .then(res => {
        children = _.map(_.filter(res, o => o !== undefined), o => o[0]._id);
        if (children.length === 0) children = undefined;
      })
      .then(() => db.open())
      .then(collection => {
        var findQuery = {};
        if (id) findQuery._id = { $regex: new RegExp(`^${id}`, "i") };
        if (title) findQuery.title = { $regex: new RegExp(`${title}`, "i") };
        if (parents) findQuery.parents = { $all: parents };
        if (children) findQuery.children = { $all: children };
        if (tags) findQuery.tags = { $all: tags };
        if (priority) findQuery.priority = priority;
        if (entryBefore) findQuery.entryDate = { $lt: entryBefore };
        else if (entryAfter) findQuery.entryDate = { $gt: entryAfter };
        if (modifiedBefore) findQuery.modifiedDate = { $lt: modifiedBefore };
        else if (modifiedAfter) findQuery.modifiedDate = { $gt: modifiedAfter };
        if (dueBefore) findQuery.dueDate = { $lt: dueBefore };
        else if (dueAfter) findQuery.dueDate = { $gt: dueAfter };
        findQuery.hidden = hidden ? hidden : false;
        return collection.find(findQuery).toArray();
      })
      .then(data => _.map(data, o => new Task(o)));
  },

  filterClosed: ({
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
    console.log("Filter Closed");
    return db
      .searchClosed(parents)
      .then(res => {
        parents = _.map(_.filter(res, o => o !== undefined), o => o[0]._id);
        if (parents.length === 0) parents = undefined;
        return db.searchClosed(children);
      })
      .then(res => {
        children = _.map(_.filter(res, o => o !== undefined), o => o[0]._id);
        if (children.length === 0) children = undefined;
      })
      .then(() => db.closed())
      .then(collection => {
        var findQuery = {};
        if (id) findQuery._id = { $regex: new RegExp(`^${id}`, "i") };
        if (title) findQuery.title = { $regex: new RegExp(`${title}`, "i") };
        if (parents) findQuery.parents = { $all: parents };
        if (children) findQuery.children = { $all: children };
        if (tags) findQuery.tags = { $all: tags };
        if (priority) findQuery.priority = priority;
        if (entryBefore) findQuery.entryDate = { $lt: entryBefore };
        else if (entryAfter) findQuery.entryDate = { $gt: entryAfter };
        if (modifiedBefore) findQuery.modifiedDate = { $lt: modifiedBefore };
        else if (modifiedAfter) findQuery.modifiedDate = { $gt: modifiedAfter };
        if (dueBefore) findQuery.dueDate = { $lt: dueBefore };
        else if (dueAfter) findQuery.dueDate = { $gt: dueAfter };
        findQuery.hidden = hidden ? hidden : false;
        return collection.find(findQuery).toArray();
      })
      .then(data => _.map(data, o => new Task(o)));
  }
};
