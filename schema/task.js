const _ = require("lodash");
const db = require("../db.js");

module.exports.taskSchema = `
  type Task {
    id: ID!
    title: String!
    parents: [Task]!
    children: [Task]!
    tags: [String]!
    priority: Int!
    entryDate: BigInt!
    dueDate: BigInt
    doneDate: BigInt
    modifiedDate: BigInt!
    times: [[BigInt!]!]!
    hidden: Boolean!
    urg(weights: JSON): Float!
    active: Boolean!
  }
`;

class Task {
  constructor(body) {
    this.id = body.id;
    this.title = body.title;
    this.parentsIds = body.parents;
    this.childrenIds = body.children;
    this.tags = body.tags;
    this.priority = body.priority;
    this.entryDate = body.entryDate;
    this.dueDate = body.dueDate;
    this.doneDate = body.doneDate;
    this.modifiedDate = body.modifiedDate;
    this.times = body.times;
    this.hidden = body.hidden;
  }

  parents() {
    return _.map(
      this.parentsIds,
      id =>
        new Task(
          db
            .get("open")
            .find({ id: id })
            .value()
        )
    );
  }

  children() {
    return _.map(
      this.childrenIds,
      id =>
        new Task(
          db
            .get("open")
            .find({ id: id })
            .value()
        )
    );
  }

  urgDueDate() {
    if (!this.dueDate) return 0.0;
    const daysDue = (_.now() - this.dueDate) / 86400000;
    const totalActive = (this.dueDate - this.entryDate) / 86400000;
    const a = -4.39449 / totalActive;
    const b = -2.19722 / a;
    return 1.0 / (1 + Math.exp(a * (daysDue + b)));
  }

  urg({ weights }) {
    if (!weights) weights = {};
    if (this.priority === 0) return 0.0;
    var urg = 0.0;
    urg += Math.abs(
      parseFloat(weights.age || 0.01429) *
        ((Date.now() - this.entryDate) / 86400000)
    );
    urg += Math.abs(parseFloat(weights.due || 9.0) * this.urgDueDate());
    urg += Math.abs(
      parseFloat(weights.parents || 1.0) * this.parentsIds.length
    );
    urg += Math.abs(
      parseFloat(weights.children || 0.5) * this.childrenIds.length
    );
    urg += Math.abs(parseFloat(weights.tags || 0.2) * this.tags.length);
    urg += Math.abs(parseFloat(weights.priority || -2.0) * this.priority + 10);
    urg += Math.abs(
      parseFloat(weights.active || 4.0) *
        (this.times &&
        this.times.length !== 0 &&
        _.last(this.times).length === 1
          ? 1.0
          : 0.0)
    );
    return urg;
  }

  active() {
    return this.times.length !== 0 && _.last(this.times).length === 1;
  }
}

module.exports.Task = Task;
