import { ApolloGateway, IntrospectAndCompose } from "@apollo/gateway";
import { ApolloServer } from "apollo-server";

const gateway = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: [
      {
        name: 'authors',
        url: 'http://localhost:4001/graphql',
      },
      {
        name: 'posts',
        url: 'http://localhost:4002/graphql',
      },
    ],
  }),
});

const server = new ApolloServer({
  gateway,
  subscriptions: false
});

server.listen(4000).then(({ url }) => {
  console.log(`🚀 Gateway API running at ${url}`);
});