const express = require("express");
const graphqlHTTP = require("express-graphql");

const app = express();
const { schema, root } = require("./schema");

app.use(
  "/api/graphql",
  graphqlHTTP({ schema: schema, rootValue: root, graphiql: true })
);

app.listen(8000, () => {
  console.log("App listening on port 8000");
});
