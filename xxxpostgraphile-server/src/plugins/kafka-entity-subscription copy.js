import { Kafka } from 'kafkajs';

export default function KafkaEntitySubscriptionPlugin(builder) {
  console.log("[KafkaEntitySubscriptionPlugin] Plugin function loaded.");
  builder.hook('init', async (_, { addLiveSubscriptionEvent }) => {
    console.log("[Kafka] Initializing plugin");

    const kafka = new Kafka({
      clientId: 'postgraphile',
      brokers: ['my-cluster-kafka-bootstrap:9092']
    });

    const consumer = kafka.consumer({ groupId: 'postgraphile-entity-updates' });
    
    try {
      await consumer.connect();
      console.log("[Kafka] Connected to Kafka broker(s).");

      await consumer.subscribe({ topic: 'capitalis.entity_changes' });
      console.log("[Kafka] Subscribed to topic: capitalis.entity_changes");

      await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          const rawValue = message.value?.toString();
          console.log(`[Kafka] Message received on ${topic} partition ${partition}:`, rawValue?.slice(0, 200));
          if (!rawValue) return;
          let event;
          try {
            event = JSON.parse(rawValue);
            console.log("[Kafka] Parsed event:", event);
          } catch (err) {
            console.error("[Kafka] JSON parse error:", err, "Raw value:", rawValue);
            return;
          }
          addLiveSubscriptionEvent('EntityUpdated', {
            entity: event.entity,
            data: event.data
          });
          console.log("[Kafka] Emitted EntityUpdated event:", { entity: event.entity, data: event.data });
        }
      });
    } catch (error) {
      console.error("[Kafka] Connection failed:", error);
    }
  });

  builder.hook('GraphQLSchema:subscriptionField', (schemaBuilder) => {
    schemaBuilder.field('entityUpdated', (t) => {
      t.field({
        type: t.object({
          name: 'EntityUpdatePayload',
          fields: (t) => ({
            entity: t.exposeString('entity'),
            data: t.expose('data', { type: 'JSON', nullable: false }),
          }),
        }),
        args: {},
        subscribe: () => {
          console.log("[KafkaEntitySubscriptionPlugin] GraphQL client subscribed to entityUpdated.");
          return t.live.subscribe('EntityUpdated');
        },
        resolve: (event) => {
          console.log("[KafkaEntitySubscriptionPlugin] Resolving event to client:", event);
          return event;
        },
      });
    });
  });
}
