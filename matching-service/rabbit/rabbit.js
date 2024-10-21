var amqp = require('amqplib');
const dotenv = require('dotenv').config();

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


exports.createChannel = async () => {
    try {
        const connection = await amqp.connect(process.env.RABBIT_URI ? process.env.RABBIT_URI :'amqp://rabbitmq:5672')
        const channel = await connection.createChannel()
        await channel.assertExchange(RESULT_EXCHANGE, 'direct')
        await channel.assertExchange(REQUEST_EXCHANGE, 'direct')
        return channel
    } catch (e) {
        console.log(e)
    }
}

exports.sendMatchResult = (channel, payload) => {
    try {
        channel.publish(RESULT_EXCHANGE, MATCH_RESULT_ROUTING, payload)
    } catch (e) {
        console.log(e)
    }
}

exports.sendCancelResult = (channel, payload) => {
    try {
        channel.publish(RESULT_EXCHANGE, CANCEL_RESULT_ROUTING, payload)
    } catch (e) {
        console.log(e)
    }
}

exports.receiveMatchRequest = async (channel, callback) => {
    try {
        const queue = await channel.assertQueue(MATCH_REQUEST_QUEUE) 
        channel.bindQueue(queue.queue, REQUEST_EXCHANGE, MATCH_REQUEST_ROUTING)
        channel.consume(queue.queue, (data) => {
            if (data) {
                console.log('Match request arrived: ' + data.content.toString());
                callback(data);  // Pass the message data to the callback
                channel.ack(data);  // Acknowledge the message
            } else {
                console.log('No data received');
            }
        });
    } catch(e) {
        console.log(e)
    }
}


exports.receiveCancelRequest = async (channel, callback) => {
    try {
        const queue = await channel.assertQueue(CANCEL_REQUEST_QUEUE) 
        channel.bindQueue(queue.queue, REQUEST_EXCHANGE, CANCEL_REQUEST_ROUTING)
        channel.consume(queue.queue, (data) => {
            if (data) {
                console.log('Cancel request arrived: ' + data.content.toString());
                callback(data);  // Pass the message data to the callback
                channel.ack(data);  // Acknowledge the message
            } else {
                console.log('No data received');
            }
        });
    } catch(e) {
        console.log(e)
    }
}