const graphql = require("graphql");
const db = require("../db.js");

module.exports.scalarsSchema = `
  scalar BigInt
  scalar JSON
`;
