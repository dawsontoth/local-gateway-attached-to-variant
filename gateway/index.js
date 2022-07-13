import { ApolloGateway, IntrospectAndCompose } from '@apollo/gateway';
import { ApolloServer } from 'apollo-server';
import {
  GetServiceList,
  GetSDLFromStudio,
  config,
} from './get-service-list.js';

async function createAndRunServer() {
  const studioSchema = await GetSDLFromStudio();

  const subgraphs = await GetServiceList();

  const localServiceListGraph = new IntrospectAndCompose({
    subgraphs,
  });

  const supergraphSdl = !!config.fed2 ? studioSchema : localServiceListGraph;

  const gateway = new ApolloGateway({
    supergraphSdl,
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
