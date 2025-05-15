import { makeExtendSchemaPlugin, gql } from "postgraphile/utils";

export default makeExtendSchemaPlugin((build) => {
  const { users } = build.input.pgRegistry.pgResources;
  return {
    typeDefs: gql`
      type MyObject {
        id: Int
      }
    `,
    plans: {
      MyObject: {
        // Graphile Build "scope" for the object type 'MyObject'
        __scope: {
          pgTypeResource: users,
        },

        id: {
          // The Graphile Build "scope" for the 'MyObject.id' field
          scope: {
            pgFieldAttribute: users.codec.attributes.id,
          },

          // The plan resolver for the 'MyObject.id' field
          plan($obj) {
            return $obj.get("id");
          },
        },
      },
    },
  };
});