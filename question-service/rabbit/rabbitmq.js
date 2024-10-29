import * as amqp from 'amqplib';

const REQUEST_EXCHANGE = 'REQUEST-EXCHANGE';
const RESULT_EXCHANGE = 'RESULT-EXCHANGE'

const QUESTION_REQUEST_QUEUE = 'QUESTION-REQUEST-QUEUE';
const QUESTION_REQUEST_ROUTING = 'QUESTION-REQUEST-ROUTING';

const MATCH_TO_QUESTION_QUEUE = 'MATCH-TO-QUESTION-QUEUE'
const QUESTION_TO_USER_QUEUE = 'QUESTION-TO-USER-QUEUE'
const MATCH_TO_QUESTION_ROUTING = 'MATCH-TO-QUESTION-ROUTING'
const QUESTION_TO_USER_ROUTING = 'QUESTION-TO-USER-ROUTING'

const initializeRabbitMQ = async () => {
    try {
        const connection = await amqp.connect(process.env.RABBIT_URI || 'amqp://localhost');
        const channel = await connection.createChannel();
        let payload = null

        // Start consuming messages
        channel.consume(QUESTION_REQUEST_QUEUE, (msg) => {
            if (msg !== null) {
                const requestPayload = JSON.parse(msg.content.toString());
                console.log('Received add question request:', requestPayload);
                
                // Process the request (e.g., fetch a random question)
                const question = getRandomQuestion(); // Your function to retrieve a question

                payload = { requestPayload, question }
                
                
                // Acknowledge the message after processing
                channel.ack(msg);

                // Optionally, send the response to the match-service
            }
        });

        // send the payload with question attached to the user service 
        if (payload) {
            channel.publish(RESULT_EXCHANGE, QUESTION_TO_USER_ROUTING, payload)
        }
    } catch (error) {
        console.error('Failed to initialize RabbitMQ connection:', error);
    }
};




// Call this function during server startup
initializeRabbitMQ();
