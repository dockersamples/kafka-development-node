function getKafkaConnectSettings() {
  const config = {
    clientId: (process.env.KAFKA_CLIENT_ID || "demo-app"),

    // localhost:9092 will only work when running the Node app natively on your machine,
    // as localhost resolves to the container's own interfaces when in a container.
    // When running in Compose, KAFKA_BROKERS is set to point to the Kafka service.
    brokers: (process.env.KAFKA_BROKERS || "localhost:9092").split(","),
  };

  if (process.env.NODE_ENV === "production") {
    // Update the config object with cert settings, SASL settings, etc.
    // Omitting this in this example for simplicity.
  }

  return config;
}

function getKafkaTopicName() {
  return process.env.KAFKA_TOPIC || "demo";
}

/**
 * Get the Kafka group ID to use for the consumer.
 * 
 * During development, a random group ID is generated to reduce the amount
 * of time spent waiting for a consumer to start receiving messages. When
 * the same ID is used, app restarts will trigger a consumer group rebalancing
 * and the consumer will have to wait for that to complete before it can start
 * receiving messages.
 * @returns {string} The Kafka group ID to use for the consumer.
 */
function getKafkaGroupId() {
  return process.env.KAFKA_GROUP_ID || "demo-group-" + Math.random().toString(16).substring(2, 8);
}

module.exports = {
  getKafkaConnectSettings,
  getKafkaTopicName,
  getKafkaGroupId,
};