const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const axios = require('axios');
const { response } = require('..');

exports.executePython = async (req, res) => {
    const code = (req.body.code);
    console.log(code);

    try {
        const response = await axios.post('https://asia-southeast1-root-cathode-440715-j7.cloudfunctions.net/executePython2', { code });
        console.log(response.data);
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

exports.executeJavascript = async (req, res) => {
    const code = (req.body.code);
    console.log(code);

    try {
        const response = await axios.post('https://asia-southeast1-root-cathode-440715-j7.cloudfunctions.net/executeJavascript', { code });
        console.log(response.data);
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}