const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv').config();
const { createChannel, receiveMatchRequest, receiveCancelRequest } = require('./rabbit/rabbit.js');
const { processMatchRequest, processCancelRequest } = require('./controllers/matching-controller.js')

const app = express()

app.use(cors()); // config cors so that front-end can use
app.options("*", cors());

// To handle CORS Errors
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // "*" -> Allow all links to access

    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    );

    // Browsers usually send this before PUT or POST Requests
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, PATCH");
        return res.status(200).json({});
    }

    // Continue Route Processing
    next();
});

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

let channel = null;

(async () => {
    channel = await createChannel(); // Wait until channel is created
    if (channel) {
        // TODO: processMatchRequest to be implemented
        receiveMatchRequest(channel, processMatchRequest(channel));
        receiveCancelRequest(channel, processCancelRequest(channel));
    } else {
        console.error("Failed to create RabbitMQ channel.");
    }
})();



const PORT_MATCHING = process.env.PORT_MATCHING;

app.listen(PORT_MATCHING, () => {
    console.log(`Server is running on port ${PORT_MATCHING}`)
})

module.exports = app