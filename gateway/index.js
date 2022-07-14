import { ApolloGateway, IntrospectAndCompose } from '@apollo/gateway';
import { ApolloServer } from 'apollo-server';
import { GetServiceList, config } from './get-service-list.js';
import { GetSDLFromStudio } from './get-fed2-schema.js';

async function createAndRunServer() {
  let supergraphSdl;

  if (!config.useStudio) {
    const subgraphs = await GetServiceList();

    const localServiceListGraph = new IntrospectAndCompose({
      subgraphs,
    });

    supergraphSdl = localServiceListGraph;
  } else {
    supergraphSdl = !!config.fed2
      ? await GetSDLFromStudio()
      : localServiceListGraph;
  }

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
