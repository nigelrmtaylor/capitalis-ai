import fetch from "node-fetch";

const AddHttpBinPlugin = {
  name: "AddHttpBinPlugin",
  version: "0.0.0",

  schema: {
    hooks: {
      GraphQLObjectType_fields(
        fields, // Input object - the fields for this GraphQLObjectType
        build, // Build object - handy utils
        context, // Context object - used for filtering
      ) {
        const {
          extend,
          getTypeByName,
          options: { jsonScalarAsString },
        } = build;
        const {
          scope: { isRootQuery },
        } = context;
        if (!isRootQuery) {
          // This isn't the object we want to modify:
          // return the input object unmodified
          return fields;
        }

        // We don't want to introduce a new JSON type as that will clash,
        // so let's find the JSON type that other fields use:
        const JSONType = getTypeByName("JSON");

        return extend(fields, {
          httpBinHeaders: {
            type: JSONType,
            async resolve() {
              const response = await fetch("https://httpbin.org/headers");
              if (jsonScalarAsString) {
                // We've been told to provide JSON scalars in stringified format
                return response.text();
              } else {
                // By default, we can just return a dynamic "JSON" scalar
                return response.json();
              }
            },
          },
        });
      },
    },
  },
};

export default AddHttpBinPlugin;