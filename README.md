# Developing event-driven applications with Kafka and Docker

This repo contains the sample application for the [Developing event-driven applications with Kafka and Docker](https://docs.docker.com/guides/use-case/kafka/) guide on Docker Docs. While this project is written primarily in Node, the focus is on launching and using Kafka in development and the Kafka-related pieces can easily be adapted into any other language.

**Notice:** This sample repo is intended to support the guide mentioned above. As such, the application code is purposely kept simple to keep the focus on the guide's content and should not be considered production ready.

## Project Structure

This project contains the following components:

- [app/](./app) - the main "app" of the project. It simply listens to events on a Kafka topic and logs them
- [dev/publisher/](./dev/publisher/) - a simple project intended to make it easy to publish messages into the topic the main app is listening to

## Development

1. Clone the project.
  
    ```bash
    git clone https://github.com/dockersamples/kafka-development-node.git
    ```

2. Navigate into the project.

    ```bash
    cd kafka-development-node
    ```

To launch this project, you have two options - run the app natively (without containers) or run everything in containers.

### Option one - Run the app natively

To run the app natively, you will need to start a Kafka instance. Then, you can start the various apps:

1. Start Kafka by running the following command:

    ```console
    docker run -d --name=kafka -p 9092:9092 apache/kafka-native
    ```

2. Navigate into the `app` directory, install dependencies, and then start the app.

    ```console
    cd app

    yarn install

    yarn dev
    ```

3. To run the test publisher app, open another terminal and from the root of the project, run the following:

    ```console
    cd dev/publisher

    yarn install

    yarn dev
    ```

    Once it's running, you can open the app at http://localhost:3000. As you fill out the form, you should see the events be logged in the app console output.

### Option two - Run everything in containers

To run everything out of containers, you can leverage the Docker Compose configuration in the project.

1. Start Compose by running the following command:

    ```console
    docker compose up
    ```

    Within a few moments, everything will be up and running. The following URLs will open the various services:

    - [http://localhost:3000](http://localhost:3000) - the publisher app to send test messages
    - [http://localhost:8080](http://localhost:8080) - the [Kafbat UI](https://github.com/kafbat/kafka-ui) web app to interact with the cluster


## Contributing

Since this project is intended to support a specific use case guide, contributions are limited to bug fixes or security issues. If you have a question, feel free to open an issue!
