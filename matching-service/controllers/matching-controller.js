const { v4 } = require('uuid')
const { send, sendMatchResult, sendCancelResult } = require('../rabbit/rabbit.js')

const ROUTING_KEY = 'USER-ROUTING-KEY'

const waitingRequests = {}

const COMPLEXITIES_MAPPING = {
    "Easy": 1,
    "Medium": 2,
    "Hard": 3,
    "easy": 1,
    "medium": 2,
    "hard": 3
}

exports.processMatchRequest = (channel) => {
    return (data) => {
        if (data) {
            const {socketId, id, complexity, category} = JSON.parse(data.content)
            const uuid = v4()
            console.log(`Received match request: ${JSON.stringify(JSON.parse(data.content))}`)
            const request = {socketId: socketId, id: id, complexity: complexity, category: category}
            // Perfect match
            const perfectMatch = findPerfectMatch(complexity, category)
            if (perfectMatch) {
                console.log(perfectMatch)
                const waitingRequest = waitingRequests[perfectMatch]
                console.log(JSON.stringify(waitingRequest))
                delete waitingRequests[perfectMatch]
                sendMatchResult(channel, Buffer.from(JSON.stringify(createSuccessPayload(request, waitingRequest))))
            } else {
                // No perfect match
                // Add to wait queue
                waitingRequests[uuid] = request
                console.log(`Request ${uuid} waiting`)
                // Wait 30s
                setTimeout(async () => {
                    console.log(`Request ${uuid} finished waiting`)
                    if (!waitingRequests[uuid]) {
                        console.log(`Request ${uuid} already matched/cancelled`)
                        return
                    }
                    delete waitingRequests[uuid]
                    const match = findMatch(complexity, category)
                    console.log(`Request ${uuid} matched with ${match}`)
                    if (match) {
                        const waitingRequest = waitingRequests[match]
                        delete waitingRequests[match]
                        sendMatchResult(channel, Buffer.from(JSON.stringify(createSuccessPayload(request, waitingRequest))))
                    } 
                    // else {
                    //     console.log("User not matched!")
                    //     sendMatchResult(channel, Buffer.from(`User ${id} did not match`))
                    // }
                }, 30 * 1000)
            }
            // data.content = Buffer.from(JSON.stringify({id: 0, socketId: 0}))
            // this.cancelMatchRequest(channel)(data)
        }
    }
}

exports.processCancelRequest = (channel) => {
    return (data) => {
        if (data) {
            const {socketId, id} = JSON.parse(data.content)
            console.log(`Received cancel match request: ${JSON.stringify(JSON.parse(data.content))}`)
            const len = Object.keys(waitingRequests).length
            Object.entries(waitingRequests).forEach(element => {
                const [uuid, {id: id2, socketId: socketId2}] = element
                if (id2 == id, socketId2 == socketId) {
                    const request = waitingRequests[uuid]
                    delete waitingRequests[uuid]
                    console.log(`Deleted request: ${JSON.stringify(request)}`)
                    // TODO: success, send message
                    sendCancelResult(channel, Buffer.from(JSON.stringify({socketId, id, success: "success"})));
                }
            });
            if (len == Object.keys(waitingRequests).length) {
                console.log('No matching requests to cancel.')
                // TODO: no matching requests, send message
                sendCancelResult(channel, Buffer.from(JSON.stringify({socketId, id, success: "success"})));
            }
        }
    }
}

function findPerfectMatch(complexity, category) {
    for (const [uuid, waiting] of Object.entries(waitingRequests)) {
        if (waiting.complexity == complexity && waiting.category == category) {
            return uuid
        }
    }
    return null
}

function createSuccessPayload(request1, request2) {
    return {
        user1Id: request1.id,
        user2Id: request2.id,
        user1SocketId: request1.socketId,
        user2SocketId: request2.socketId
    }
}

function findMatch(complexity, category) {
    const possibleMatches = Object.entries(waitingRequests).filter(entry => entry[1].category == category)
    possibleMatches.sort((x, y) => Math.abs(COMPLEXITIES_MAPPING[x[1].complexity] - complexity) - Math.abs(COMPLEXITIES_MAPPING[y[1].complexity] - complexity))
    console.log(JSON.stringify(possibleMatches))
    if (possibleMatches.length > 0)
        return possibleMatches[0][0]
    return null
}


// exports.processCancelRequest = (channel) => {
//     return (data) => {
//         console.log('Matching service received: ', data)
//         if (data) {
//             console.log("cancel working??", data)
//             const message = data.content.toString()
//             console.log('stringify buffer: ', message)

//             const parsedData = JSON.parse(message)

//             const user1Id = parsedData["id"]
//             const user1SocketId = parsedData["socketId"]
            
//             const payload = { success: "successful", user1Id, user1SocketId }
//             console.log("json parsed in cancelling: ", JSON.parse(message))
            
//         }
//     }
// }