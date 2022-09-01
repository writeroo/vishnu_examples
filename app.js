const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors')
const fs = require('fs');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const app = express()
const port = 3000

const API_KEY = "[YOUR_API_KEY]" // replace with your API key. We recommend using an environment variable.

app.use(cors())

app.use(express.json())

app.get('/send', (req, res) => {
    // Fetching a service token from Vishnu
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
    // Getting a JWT token from Vishnu API after user has logged in
    const payload = req.body.payload;
    try {
        // Verifying the JWT token
        const decrypted = jwt.verify(payload, API_KEY);

        // Do whatever you want with the decrypted payload.. for now we will be saving it in a file

        let users = [];
        try {
            // Reading the user file
            const file = fs.readFileSync('./users.json');
            users = JSON.parse(file);
        } catch (error) {
            console.log("File not found");
        }

        // Adding the new user to the list
        users.push(decrypted);
        fs.writeFileSync('./users.json', JSON.stringify(users));

        res.status(200).send({"message" : "success"});
    } catch (error) {
        res.status(403).send("JWT verification failed");
    }
});

app.get('/', (req, res) => {
    // Login page
    res.sendFile(__dirname + '/public/index.html')
});

app.get('/vishnu.js', (req, res) => {
    // Vishnu JS file
    res.sendFile(__dirname + '/public/vishnu.js')
});

app.get('/redirect', (req, res) => {
    // User will be redirected to this page after logging in
    res.sendFile(__dirname + '/public/redirect.html')
});

app.get('/user', (req, res) => {
    // Getting a conf token from query params
    const conf_token = req.query.conf;
    try {
        // Fetching user data
        const file = fs.readFileSync('./users.json');
        const users = JSON.parse(file);
        // Finding the user with the conf token
        const user = users.find(user => user.conf_token === conf_token);
        user ? res.send(user) : res.status(404).send("User not found");
    } catch (error) {
        res.status(404).send("User file not found");
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})