import { listen } from "postgraphile/grafast";
import { Kafka } from "kafkajs";
import { makeExtendSchemaPlugin, gql } from "postgraphile/utils";

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
export default makeExtendSchemaPlugin((build) => {

  // Get any helpers we need from `build`
  const { sql, inflection } = build;

  return {
    name: "KafkaEntitySubscriptionPlugin",
    description: "Handles Kafka entity updates",
    typeDefs: gql`
    extend type Subscription {
      entityUpdated: EntityUpdated
    }
    type EntityUpdated {
      entity: String
      data: JSON
    }
  `,
    plans: {
      Subscription: {
        entityUpdated: {
          subscribePlan() {
            return listen(
              {
                subscribe: (onEvent) => {
                  subscribers.add(onEvent);
                  return () => subscribers.delete(onEvent);
                },
              },
              null,
              (x) => x // identity function, since event is already an object
            );
          },
          plan($event) {
            return $event;
          },
        },
      },
      EntityUpdated: {
        entity($event) {
          return $event.entity;
        },
        data($event) {
          return $event.data;
        },
      },
    },

  };
});