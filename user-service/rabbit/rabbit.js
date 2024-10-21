import * as amqp from 'amqplib'
import "dotenv/config";

const REQUEST_EXCHANGE = 'REQUEST-EXCHANGE'
const RESULT_EXCHANGE = 'RESULT-EXCHANGE'

const MATCH_REQUEST_QUEUE = 'MATCH-REQUEST-QUEUE'
const MATCH_RESULT_QUEUE = 'MATCH-RESULT-QUEUE'
const MATCH_REQUEST_ROUTING = 'MATCH-REQUEST-ROUTING'
const MATCH_RESULT_ROUTING = 'MATCH-RESULT-ROUTING'

const CANCEL_REQUEST_QUEUE = 'CANCEL-REQUEST-QUEUE'
const CANCEL_RESULT_QUEUE = 'CANCEL-RESULT-QUEUE'
const CANCEL_REQUEST_ROUTING = 'CANCEL-REQUEST-ROUTING'
const CANCEL_RESULT_ROUTING = 'CANCEL-REQUEST-ROUTING'


export const createChannel = async () => {
    try {
        const connection = await amqp.connect(process.env.RABBIT_URI ? process.env.RABBIT_URI :'amqp://rabbitmq:5672')
        const channel = await connection.createChannel()

        await channel.assertExchange(REQUEST_EXCHANGE, 'direct')
        const matchRequestQueue = await channel.assertQueue(MATCH_REQUEST_QUEUE)
        channel.bindQueue(matchRequestQueue.queue, REQUEST_EXCHANGE, MATCH_REQUEST_ROUTING)
        const cancelRequestQueue = await channel.assertQueue(CANCEL_REQUEST_QUEUE)
        channel.bindQueue(cancelRequestQueue.queue, REQUEST_EXCHANGE, CANCEL_REQUEST_ROUTING)
        
        await channel.assertExchange(RESULT_EXCHANGE, 'direct')
        const matchResultQueue = await channel.assertQueue(MATCH_RESULT_QUEUE)
        channel.bindQueue(matchResultQueue.queue, RESULT_EXCHANGE, MATCH_RESULT_ROUTING)
        const cancelResultQueue = await channel.assertQueue(CANCEL_RESULT_QUEUE)
        channel.bindQueue(cancelResultQueue.queue, RESULT_EXCHANGE, CANCEL_RESULT_ROUTING)

        return channel
    } catch (e) {
        console.log(e)
    }
}

export const sendMatchRequest = (channel, payload) => {
    try {
        channel.publish(REQUEST_EXCHANGE, MATCH_REQUEST_ROUTING, Buffer.from(JSON.stringify(payload)))
    } catch (e) {
        console.log(e)
    }
}

export const sendCancelRequest = (channel, payload) => {
    try {
        console.log("sendCancelRequesting : ", JSON.stringify(payload))
        channel.publish(REQUEST_EXCHANGE, CANCEL_REQUEST_ROUTING, Buffer.from(JSON.stringify(payload)))
    } catch (e) {
        console.log(e)
    }
}

export const receiveMatchResult = async (channel, io) => {
    try {
        channel.consume(MATCH_RESULT_QUEUE, (data) => {
            if (data) {
                const message = data.content.toString()
                channel.ack(data)
                // Emit socket.io event when a match is found
                const matchData = JSON.parse(message);
                console.log("matchdata: ", matchData)
                console.log('User 1 Socket ID:', matchData.user1SocketId);

                const user1Socket = io.sockets.sockets.get(matchData.user1SocketId); // User 1's socket
                const user2Socket = io.sockets.sockets.get(matchData.user2SocketId); // User 2's socket

                if (user1Socket && user2Socket) {
                    // Notify User 1
                    user1Socket.emit('match_found', {
                        success: true,
                        matchedUser: { id: matchData.user2Id },
                    });

                    // Notify User 2
                    user2Socket.emit('match_found', {
                        success: true,
                        matchedUser: { id: matchData.user1Id },
                    });
                }
            }
        })
    } catch (e) {
        console.log(e)
    }
}

export const receiveCancelResult = async (channel, io) => {
    try {
        
    } catch (e) {
        console.log(e)
    }
}
