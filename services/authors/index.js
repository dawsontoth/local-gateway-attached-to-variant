import { ApolloServer } from "apollo-server";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { resolvers } from "./resolvers.js";
import { typeDefs } from "./typeDefs.js";

const schema = buildSubgraphSchema([{ typeDefs, resolvers }]);
const server = new ApolloServer({ schema });

server.listen(4001).then(({ url }) => {
  console.log(`🚀 Authors service ready at ${url}`);
});