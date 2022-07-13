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

function makeSubgraphSDLQueryPayload() {
  return {
    operationName: 'GetSubgraphSdls',
    query: `query GetSubgraphSdls($serviceId: ID!, $graphVariant: String!) {
      service(id: $serviceId) {
        implementingServices(graphVariant: $graphVariant) {
          ... on FederatedImplementingServices {
            services {
              name
              url
              activePartialSchema {
                sdl
              }
            }
          }
        }
      }
    }`,
    variables: { serviceId: config.graphName, graphVariant: config.variant },
  };
}

function checkForReplacementSubGraph(apiNames) {
  const configNames = config.replacedServices.map((s) => s.name);

  let found = false;

  for (const replacementName in configNames) {
    if (apiNames.indexOf(replacementName) > -1) {
      found = true;
      break;
    }
  }

  return found;
}

function getHeaders() {
  return {
    'X-API-KEY': config.apiKey,
    'apolloggraphql-client-name': `LGATV-${config.apiKey}`,
  };
}

export async function GetServiceList() {
  const { data, errors } = await axios.post(
    'https://graphql.api.apollographql.com/api/graphql',
    makeSubgraphQueryPayload(),
    {
      headers: getHeaders(),
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

  const { subgraphs } = data.data.graph.variant;

  if (checkForReplacementSubGraph(subgraphs.map((s) => s.name))) {
    throw new Error(
      'No subgraph replacements were found. Please make sure the settings.yaml has a service to be replaced.'
    );
  }

  return Object.values({
    ...subgraphs,
    ...config.replacedServices,
  });
}

export async function GetSDLFromStudio() {
  const { data, errors } = await axios.post(
    'https://graphql.api.apollographql.com/api/graphql',
    makeSubgraphSDLQueryPayload(),
    {
      headers: getHeaders(),
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

  const { services } = data.data.service.implementingServices;

  if (checkForReplacementSubGraph(services.map((s) => s.name))) {
    throw new Error(
      'No subgraph replacements were found. Please make sure the settings.yaml has a service to be replaced.'
    );
  }

  const subgraphs = {
    useFromStudio: [],
    local: [],
  };

  services.map((service) => {
    const indexOfReplacement = config.replacedServices
      .map((s) => s.name)
      .indexOf(service.name);

    if (indexOfReplacement > -1) {
      subgraphs.local.push(config.replacedServices[indexOfReplacement]);
    } else {
      subgraphs.useFromStudio.push({
        name: service.name,
        url: service.url,
        sld: service.activePartialSchema.sdl,
      });
    }
  });

  console.log(JSON.stringify(subgraphs));

  console.log('\n\nsuccessfully finished function\n\n');
  return;
}
