# Local gateway attached to variant

**The code in this repository is experimental and has been provided for reference purposes only. Community feedback is welcome but this project may not be supported in the same way that repositories in the official [Apollo GraphQL GitHub organization](https://github.com/apollographql) are. If you need help you can file an issue on this repository, [contact Apollo](https://www.apollographql.com/contact-sales) to talk to an expert, or create a ticket directly in Apollo Studio.**

## Intent

The intent of this repo is to create a running gateway that one is able to hook up to a supergraph and replace subgraphs with local subgraphs for testing. For example if you have 10 subgraphs running in staging and want to test your changes to one of the subgraphs. You should be able to run this project to use 9 unchanged subgraphs in staging and your local subgraph with your changes for local testing.

## Installation

To install packages please run a `yarn` from the root.

## Usage

### prerequisite/setup

- Have an Apollo studio account
  - Have an API key for said account
- Have the name and variant of the super graph you want to use.

### Using the package

Please go to the `./settings.yaml` file and replace the data with your desired data.

- `replacedServices` is the set of services you want to over ride from studio with your local services. It should have the **same name** as the services you want to replace.
  - it should follow the same pattern as below:

```yaml
replacedServices:
  - name: posts
    url: http://localhost:4003/graphql
```

- `graphName` and `variant` are also in this file. These are what the server will use for the rover commands.
  - a command similar to `rover subgraph list ${config.graphName}@${config.variant}` is used. If you are not seeing the expected results please check the values from here first.

### Starting the server

After modifying the config file. Run a `yarn watch` or `yarn start` command.

- Watch will start the server with nodemon.
- Start will start the server with node.

## Known Limitations

- The subgraphs used by this super graph need to be accessible by your local machine. So you may have to expose some services though port forwarding or connecting to a VPN
- Introspection needs to be enabled for these subgraphs. The function used from `@apollo/gateway` will use introspection to pull the schema from each subgraph.

## Notes

- Make sure the subgraph is started before starting the gateway.
- you can replace multiple subgraphs at once.
