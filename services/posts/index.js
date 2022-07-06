import { ApolloServer } from "apollo-server";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { resolvers } from "./resolvers.js";
import { typeDefs } from "./typeDefs.js";

const schema = buildSubgraphSchema([{ typeDefs, resolvers }]);

const server = new ApolloServer({ schema });

server.listen(4002).then(({ url }) => {
  console.log(`🚀 Posts service ready at ${url}`);
});