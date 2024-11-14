var amqp = require('amqplib');

const { getRandomQuestion } = require('../models/questionModel')

const REQUEST_EXCHANGE = 'REQUEST-EXCHANGE';
const RESULT_EXCHANGE = 'RESULT-EXCHANGE'

const QUESTION_REQUEST_QUEUE = 'QUESTION-REQUEST-QUEUE';
const QUESTION_REQUEST_ROUTING = 'QUESTION-REQUEST-ROUTING';

const MATCH_TO_QUESTION_QUEUE = 'MATCH-TO-QUESTION-QUEUE'
const MATCH_TO_QUESTION_ROUTING = 'MATCH-TO-QUESTION-ROUTING'


const QUESTION_TO_USER_ROUTING = 'QUESTION-TO-USER-ROUTING'

const initializeRabbitMQ = async () => {
    try {
        const connection = await amqp.connect(process.env.RABBIT_URI || 'amqp://rabbitmq:5672');
        const channel = await connection.createChannel();
        await channel.assertExchange(RESULT_EXCHANGE, 'direct')
        await channel.assertExchange(REQUEST_EXCHANGE, 'direct')
        const queue = await channel.assertQueue(MATCH_TO_QUESTION_QUEUE)
        channel.bindQueue(queue.queue, REQUEST_EXCHANGE, MATCH_TO_QUESTION_ROUTING)

        let payload = null

        // Start consuming messages
        channel.consume(MATCH_TO_QUESTION_QUEUE, async (msg) => {
            if (msg !== null) {

                // payload: userID1, userID2, socketID1, socketID2, complexity, category
                const requestPayload = JSON.parse(msg.content.toString());
                console.log('Received add question request:', requestPayload);

                // Process the request (e.g., fetch a random question)
                const question = await getRandomQuestion(requestPayload); // Your function to retrieve a question


                // payload: userID1, userID2, socketID1, socketID2, complexity, category, question
                payload = { ...requestPayload, question }

                // Acknowledge the message after processing
                channel.ack(msg);

                // Optionally, send the response to the match-service
                // send the payload with question attached to the user service 
                if (payload) {
                    console.log("there is a payload: ", payload)
                    channel.publish(RESULT_EXCHANGE, QUESTION_TO_USER_ROUTING, Buffer.from(JSON.stringify(payload)))
                }
            }
        });


    } catch (error) {
        console.error('Failed to initialize RabbitMQ connection:', error);
    }
};

module.exports = initializeRabbitMQ