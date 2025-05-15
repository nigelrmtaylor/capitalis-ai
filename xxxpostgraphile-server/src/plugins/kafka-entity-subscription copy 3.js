import { field, listen } from "grafast";
import { Kafka } from "kafkajs";
import { GraphQLJSON } from "graphql-type-json";

// Simple in-memory pubsub for demo purposes
const subscribers = new Set();

function publishEvent(event) {
  for (const fn of subscribers) {
    fn(event);
  }
}

async function startKafkaConsumer() {
  if (!process.env.KAFKA_BROKERS) {
    console.error("[Kafka] Configuration Error: KAFKA_BROKERS environment variable is not set.");
    throw new Error("KAFKA_BROKERS environment variable must be set (comma-separated list of brokers)");
  }
  const brokers = process.env.KAFKA_BROKERS.split(',').map(b => b.trim());
  console.log("[Kafka] Connecting to brokers:", brokers);
  const kafka = new Kafka({
    clientId: "postgraphile",
    brokers,
  });

  const consumer = kafka.consumer({ groupId: "postgraphile-entity-updates" });

  await consumer.connect();
  await consumer.subscribe({ topic: "capitalis.entity_changes" });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const rawValue = message.value.toString();
        console.log(`[Kafka] Message received on topic '${topic}' partition ${partition}:`, rawValue);
        const event = JSON.parse(rawValue);
        console.log('[Kafka] Parsed event:', event);
        publishEvent(event);
      } catch (err) {
        console.error("[Kafka] JSON parse error:", err);
      }
    },
  });
}

// Start the Kafka consumer once when the server starts
startKafkaConsumer().catch((err) =>
  console.error("[Kafka] Failed to start consumer:", err)
);



const entityUpdatedField = field({
  type: GraphQLJSON,
  description: "Fires when an entity is updated via Kafka",
  subscribe() {
    return listen(
      {
        subscribe: (onEvent) => {
          subscribers.add(onEvent);
          return () => subscribers.delete(onEvent);
        },
      },
      null,
      (x) => x
    );
  },
  resolve(event) {
    return event;
  },
});

export default {
  name: "KafkaEntitySubscriptionPlugin",
  subscriptionFields: {
    entityUpdated: entityUpdatedField,
  },
};
 
 