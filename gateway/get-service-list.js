import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = yaml.load(
  fs.readFileSync(path.resolve(__dirname, '../settings.yaml'), {
    encoding: 'utf-8',
  })
);

function makeSubgraphQueryPayload() {
  return {
    operationName: 'SubgraphListQuery',
    query:
      'query SubgraphListQuery($graph_id: ID!, $variant: String!) {  frontendUrlRoot  graph(id: $graph_id) {    variant(name: $variant) {      subgraphs {        name        url        updatedAt      }    }  }}',
    variables: { graph_id: config.graphName, variant: config.variant },
  };
}

export async function GetServiceList() {
  const { data, errors } = await axios.post(
    'https://graphql.api.apollographql.com/api/graphql',
    makeSubgraphQueryPayload(),
    {
      headers: {
        'X-API-KEY': config.apiKey,
      },
    }
  );

  if (errors || !data.data) {
    throw new Error(
      `something went wrong when talking to studio: ${
        errors
          ? JSON.stringify(errors)
          : 'No graphs were received. Please check your settings have an API key, graph name and variant and try again.'
      }`
    );
  }

  return data.data.graph.variant.subgraphs;
}
