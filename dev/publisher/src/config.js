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

module.exports = {
  getKafkaConnectSettings,
  getKafkaTopicName,
};