const express = require("express");
const graphqlHTTP = require("express-graphql");

const app = express();
const port = process.env.PORT || 8000;
const { schema, root } = require("./schema");

app.use(
  "/api",
  graphqlHTTP({ schema: schema, rootValue: root, graphiql: true })
);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
