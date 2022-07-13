import { gql } from 'apollo-server';

export const typeDefs = gql`
  directive @tag(name: String!) repeatable on FIELD_DEFINITION | OBJECT

  type User @key(fields: "email") {
    email: ID! @tag(name: "test-from-users")
    name: String
    totalProductsCreated: Int
  }
`;
