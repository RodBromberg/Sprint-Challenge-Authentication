const axios = require('axios');
const bcrypt = require('bcryptjs')
const db = require('../database/dbConfig.js')
const Users = require('../database/dbMethods')
const jwt = require('jsonwebtoken')
const generateToken = require('../auth/generateToken.js')
const { authenticate } = require('../auth/authenticate');

module.exports = server => {
    server.post('/api/register', register);
    server.post('/api/login', login);
    server.get('/api/jokes', authenticate, getJokes);
};

function register(req, res) {
    // implement user registration
    const creds = req.body;
    const hash = bcrypt.hashSync(creds.password, 13)
    creds.password = hash;
    db('users')
        .insert(creds)
        .then(added => {
            res.status(201).json(added)
        })
        .catch(err => {
            res.status(400).json(err)
        })
}

function login(req, res) {
    // implement user login
    let { username, password } = req.body;

    Users.findBy({ username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)) {
                const token = generateToken(user);
                res.status(200).json({
                    message: `Welcome ${user.username}!`,
                    token,
                });
            } else {
                res.status(401).json({ message: 'Invalid Credentials' });
            }
        })
        .catch(error => {
            res.status(500).json(error);
        });
}


function getJokes(req, res) {
    const requestOptions = {
        headers: { accept: 'application/json' },
    };

    axios
        .get('https://icanhazdadjoke.com/search', requestOptions)
        .then(response => {
            res.status(200).json(response.data.results);
        })
        .catch(err => {
            res.status(500).json({ message: 'Error Fetching Jokes', error: err });
        });
}