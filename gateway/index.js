import { ApolloGateway, LocalCompose } from '@apollo/gateway';
import { ApolloServer } from 'apollo-server';
import { GetServiceList } from './get-service-list.js';

async function createAndRunServer() {
  const localServiceList = await GetServiceList();

  const gateway = new ApolloGateway({
    supergraphSdl: new LocalCompose({
      localServiceList,
    }),
  });

  const server = new ApolloServer({
    gateway,
    subscriptions: false,
  });

  server.listen(4000).then(({ url }) => {
    console.log(`🚀 Gateway API running at ${url}`);
  });
}

createAndRunServer();
