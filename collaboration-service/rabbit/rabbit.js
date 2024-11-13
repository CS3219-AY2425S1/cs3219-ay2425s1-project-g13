const amqp = require('amqplib');

const REQUEST_EXCHANGE = 'REQUEST-EXCHANGE'
const RESULT_EXCHANGE = 'RESULT-EXCHANGE'

const COLLAB_TO_USER_ROUTING = 'COLLAB-TO-USER-ROUTING'


exports.createChannel = async () => {
    try {
        const connection = await amqp.connect(process.env.RABBIT_URI ? process.env.RABBIT_URI : 'amqp://rabbitmq:5672')
        const channel = await connection.createChannel()
        await channel.assertExchange(RESULT_EXCHANGE, 'direct')
        await channel.assertExchange(REQUEST_EXCHANGE, 'direct')
        return channel
    } catch (e) {
        console.log(e)
    }
}


exports.sendDeleteRoomRequest = (channel, payload) => {
    try {
        console.log("sendDeleteRoomRequest called in collaboration-service")
        channel.publish(REQUEST_EXCHANGE, COLLAB_TO_USER_ROUTING, payload)
    } catch (e) {
        console.log(e)
    }
}
