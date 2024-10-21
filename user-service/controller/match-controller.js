import { sendMatchRequest, sendCancelRequest, receiveCancelResult } from "../rabbit/rabbit.js"

const CANCEL_RESULT_QUEUE = 'CANCEL-RESULT-QUEUE'

// export const cancelMatch = (channel) => {
//     return async (req, res, next) => {
//         try {
//             const payload = { id: req.user.id, socketId: req.body.socketId}
//             await sendCancelRequest(channel, payload)
//             res.status(200).send({ message: "cancel request sent" })
//         } catch (e) {
//             res.status(500).send({
//                 message: 'Failed to create new order.' + e
//             });
//         }
//     }
// }

// export const cancelMatch = (channel) => {
//     return async (req, res, next) => {
//         const { socketId } = req.body;
//         const { id } = req.user;

//         console.log("socketId: ", socketId);
//         console.log("user id: ", id);

//         return new Promise((resolve, reject) => {
//             const cancelRequestPayload = { id, socketId };
//             console.log("cancelRequestPayload: ", cancelRequestPayload);
//             sendCancelRequest(channel, cancelRequestPayload);

//             channel.consume(CANCEL_RESULT_QUEUE, (data) => {
//                 if (data) {
//                     console.log("user service received cancel result");
//                     const message = data.content.toString();
//                     channel.ack(data); // Acknowledge the message

//                     const result = JSON.parse(message);
//                     console.log("result: ", result);

//                     if (result.success) {
//                         const user1Socket = req.io.sockets.sockets.get(result.user1SocketId); // User 1's socket

//                         if (user1Socket) {
//                             console.log("Emitting match_cancelled to ", result.user1SocketId);
//                             console.log("socket: ", user1Socket)
//                             try {
//                                 user1Socket.emit('match_cancelled', {
//                                     success: true
//                                 });
//                             } catch (error) {
//                                 console.error("Error emitting match_cancelled:", error);
//                             }
//                         } else {
//                             console.warn("User 1's socket not found.");
//                         }

//                         resolve({ message: "Match cancelled successfully" });
//                     } else {
//                         reject(new Error("Failed to cancel the match"));
//                     }
//                 }
//             })
//         })
//     }
// };

export const cancelMatch = (channel) => {
    return async (req, res, next) => {
        const { socketId } = req.body;
        const { id } = req.user;

        return new Promise((resolve, reject) => {
            const cancelRequestPayload = { id, socketId };

            // Send the cancel request to RabbitMQ
            sendCancelRequest(channel, cancelRequestPayload);

            // Generate a unique consumer tag so we can cancel the consumer later
            const consumerTag = `cancel_match_consumer_${id}_${Date.now()}`;

            // Set up a consumer to listen for the cancel result
            channel.consume(CANCEL_RESULT_QUEUE, (data) => {
                if (data) {
                    const message = data.content.toString();
                    const result = JSON.parse(message);

                    console.log("Received result from cancel request:", result);

                    // Acknowledge the message
                    channel.ack(data);

                    if (result.success) {
                        resolve(result);  // Resolve the promise with the result
                    } else {
                        reject(new Error("Failed to cancel the match"));
                    }

                    // Cancel the consumer after processing the message
                    channel.cancel(consumerTag);
                }
            }, { consumerTag }); // Pass the consumer tag here
        })
        .then((result) => {
            // Send the success response after receiving the message
            res.status(200).json({ message: "Match cancelled successfully", result });
        })
        .catch((error) => {
            // Send an error response if something goes wrong
            console.error("Error in cancelMatch:", error);
            res.status(500).json({ message: error.message });
        });
    };
};





export const requestMatch = (channel) => {
    return (req, res, next) => {
        try {
            
            const payload = { id: req.user.id, ...req.body }
            sendMatchRequest(channel, payload)
            res.status(200).send({ message: "match request sent" })
        } catch (e) {
            res.status(500).send({
                message: 'Failed to create new order.' + e
            });
        }
    }
}
