const _ = require("lodash");
const db = require("../db.js");

module.exports.taskSchema = `
  type Task {
    id: ID!
    title: String!
    parents: [String!]
    children: [String!]
    tags: [String!]
    priority: Int!
    entryDate: BigInt!
    dueDate: BigInt
    doneDate: BigInt
    modifiedDate: BigInt!
    times: [[BigInt!]!]!
    hidden: Boolean
    urg: Float!
    active: Boolean!
  }
`;

module.exports.Task = class {
  constructor(body) {
    this.id = body.id;
    this.title = body.title;
    this.parents = body.parents;
    this.children = body.children;
    this.tags = body.tags;
    this.priority = body.priority;
    this.entryDate = body.entryDate;
    this.dueDate = body.dueDate;
    this.doneDate = body.doneDate;
    this.modifiedDate = body.modifiedDate;
    this.times = body.times;
    this.hidden = body.hidden;
  }

  urg() {
    return 1.0;
  }

  active() {
    return this.times.length !== 0 && _.last(this.times).length === 1;
  }
};
