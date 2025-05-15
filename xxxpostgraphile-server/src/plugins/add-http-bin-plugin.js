import { makeExtendSchemaPlugin, gql } from "postgraphile/utils";
import fetch from "node-fetch";

export default makeExtendSchemaPlugin({
  typeDefs: gql`
    extend type Query {
      httpBinHeaders: JSON
    }
  `,
  resolvers: {
    Query: {
      async httpBinHeaders() {
        const response = await fetch("https://httpbin.org/headers");
        return response.json();
      },
    },
  },
});