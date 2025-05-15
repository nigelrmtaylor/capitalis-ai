import { makeExtendSchemaPlugin, gql } from "postgraphile/utils";
import { constant, lambda } from "postgraphile/grafast";

export default makeExtendSchemaPlugin((build) => {
    // Get any helpers we need from `build`
    const { sql, inflection } = build;

    return {
        typeDefs: gql`
      extend type Query {
        meaningOfLife: Int
      }
    `,

        plans: {
            Query: {
                meaningOfLife() {
                    console.log('MeaningOfLifePlugin plan:');
                    //            return constant(42);
                    const q = 43;
                    const r = constant(42);
               //    console.log('MeaningOfLifePlugin r:', r);
                    return r;
                },
            },
        },

        /*
        // Though makeExtendSchemaPlugin and Grafast both support traditional
        // resolvers, plan resolvers are preferred for a "pure" Grafast schema.
        // Here's what the above would look like with traditional resolvers:
        resolvers: {
          Query: {
            meaningOfLife() {
              return 42;
            },
          },
        },
        */
    };
});