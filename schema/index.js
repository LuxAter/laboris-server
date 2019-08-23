const _ = require("lodash");
var { buildSchema } = require("graphql");
const BigInt = require("graphql-bigint");

const { scalarsSchema } = require("./scalars.js");
const { taskSchema, taskClass } = require("./task.js");
const { querySchema, queryRoot } = require("./query.js");
const { mutationSchema, mutationRoot } = require("./mutation.js");

module.exports.schema = buildSchema(
  scalarsSchema + taskSchema + querySchema + mutationSchema
);

module.exports.root = { ...queryRoot, ...mutationRoot };
