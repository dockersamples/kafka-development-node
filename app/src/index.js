const { Kafka } = require("kafkajs");
const { getKafkaConnectSettings, getKafkaTopicName, getKafkaGroupId } = require("./config");

const kafka = new Kafka(getKafkaConnectSettings());
const topicName = getKafkaTopicName();

const consumer = kafka.consumer({ 
  groupId: getKafkaGroupId(),
});

const run = async () => {
  await createTopicIfNeeded(topicName);

  await consumer.connect();
  await consumer.subscribe({ topic: topicName });

  console.log(`Subscribed to ${topicName}`);

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      // Do something with the message. In this case, we're just going to log it.
      console.log({
        value: message.value.toString(),
      });
    }
  });

  console.log("Running consumer");
};



/**
 * Create the topic used by the consumer if it doesn't exist.
 * Will only run in non-production environments.
 * 
 * This is not needed when KAFKA_AUTO_CREATE_TOPICS_ENABLE is set to true in the
 * Kafka broker configuration, as the topic will be created automatically when the
 * consumer subscribes to it. But, since this guide starts with launching a Kafka
 * instance using a simple `docker run` that doesn't contain the many required
 * environment variables, the topic will not exist and will not be created automatically.
 * 
 * @returns {Promise<void>} Promise that resolves when the topic is created.
 */
async function createTopicIfNeeded(topicName) {
  if (process.env.NODE_ENV === "production")
    return;

  const admin = kafka.admin();
  await admin.connect();

  try {
    const topics = await admin.listTopics();
    if (topics.includes(topicName))
      return;

    console.log(`Creating the ${topicName} topic`);
    await admin.createTopics({
      topics: [{
        topic: topicName,
        numPartitions: 1,
      }]
    });
  } finally {
    await admin.disconnect();
  }
}


run().catch(console.error);

const errorTypes = ['unhandledRejection', 'uncaughtException']
const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2']

errorTypes.forEach(type => {
  process.on(type, async e => {
    try {
      console.log(`process.on ${type}`);
      console.error(e);
      await consumer.disconnect();
      process.exit(0);
    } catch (_) {
      console.log("Error during exit, forcing exit");
      process.exit(1);
    }
  })
});

signalTraps.forEach(type => {
  process.once(type, async () => {
    try {
      console.log("Disconnecting consumer");
      await consumer.disconnect();
      console.log("Consumer disconnected");
    } catch (e) {
      console.error(`Error disconnecting consumer: ${e}`);
    } finally {
      console.log("Killing the process");
      process.kill(process.pid, type);
    }
  })
});
