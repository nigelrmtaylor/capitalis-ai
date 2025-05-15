import { makeExtendSchemaPlugin } from "postgraphile/utils";
import { context, lambda, listen } from "postgraphile/grafast";
import { jsonParse } from "postgraphile/@dataplan/json";
import { gql } from "postgraphile/utils";

export default makeExtendSchemaPlugin((build) => {
    console.log('ForumMessagesPlugin loaded');

    const { messages } = build.input.pgRegistry.pgResources;
    console.log('ForumMessagesPlugin messages:', messages);

    return {
        typeDefs: gql`
      extend type Subscription {
        forumMessage(forumId: Int!): ForumMessageSubscriptionPayload
      }

      type ForumMessageSubscriptionPayload {
        event: String
        message: Message
      }
    `,
        plans: {
            Subscription: {
                forumMessage: {
                    plan($event) {
                        return $event;
                    },
                    subscribePlan(_$root, args) {
                        const $pgSubscriber = context().get("pgSubscriber");
                        const $forumId = args.get("forumId");
                        const $topic = lambda($forumId, (id) => `forum:${id}:message`);

                        return listen($pgSubscriber, $topic, jsonParse);
                    },
                },
            },
            ForumMessageSubscriptionPayload: {
                event($event) {
                    return $event.get("event");
                },
                message($event) {
                    const $id = $event.get("id");
                    return messages.get({ id: $id });
                },
            },
        },
    };
});
