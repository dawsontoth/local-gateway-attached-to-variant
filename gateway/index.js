import { ApolloGateway, IntrospectAndCompose } from '@apollo/gateway';
import { ApolloServer } from 'apollo-server';
import { GetServiceList, config } from './get-service-list.js';
import { GetSDLFromStudio } from './get-all-subgraph-info.js';
import { GetFedTwoSuperGraphSchema } from './get-fed2-schema.js';
import { composeWithResolvedConfig } from './get-fed1-schema.js';

async function createAndRunServer() {
  let supergraphSdl;

  if (!config.useStudio) {
    const subgraphs = await GetServiceList();

    const localServiceListGraph = new IntrospectAndCompose({
      subgraphs,
    });

    supergraphSdl = localServiceListGraph;
  } else {
    const rawSchema = await GetSDLFromStudio();
    supergraphSdl = !!config.fed2
      ? await GetFedTwoSuperGraphSchema(rawSchema)
      : await composeWithResolvedConfig(localServiceListGraph);
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
