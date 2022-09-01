const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const app = express()
const port = 3000

const API_KEY = "[YOUR_API_KEY]" // replace with your API key. We recommend using an environment variable.

app.use(cors())

app.use(express.json())

app.get('/send', (req, res) => {
    fetch(`https://vishnu-api.writeroo.in/service/init`, {
        method: 'GET',
        headers: {
            'X-API-Key': API_KEY
        },
    })
    .then(response => response.json())
    .then(data => res.send({...data, return_link : "http://localhost:3000/redirect"}))
    .catch(err => res.status(401).send(err))
})

app.post('/receive', (req, res) => {
    const payload = req.body.payload;
    try {
        const decrypted = jwt.verify(payload, API_KEY);
        console.log(decrypted); 
        // Do whatever you want with the decrypted payload

        res.status(200).send({"message" : "success"});
    } catch (error) {
        res.status(403).send("JWT verification failed");
    }
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
});

app.get('/vishnu.js', (req, res) => {
    res.sendFile(__dirname + '/public/vishnu.js')
});

app.get('/redirect', (req, res) => {
    res.sendFile(__dirname + '/public/redirect.html')
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})