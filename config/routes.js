const axios = require('axios');
const bcrypt = require('bcryptjs')
const db = require('../database/dbConfig.js')
const Users = require('../database/dbMethods')
const { generateToken } = require('../auth/generateToken.js')
const { authenticate } = require('../auth/authenticate');

module.exports = server => {
    server.post('/api/register', register);
    server.post('/api/login', login);
    server.get('/api/jokes', authenticate, getJokes);
};

//ddfsdfsfdsdfsnksdfjbshl

function register(req, res) {
    // implement user registration
    const creds = req.body;
    // performs hashing alogirthm 2^13 times includes salts
    const hash = bcrypt.hashSync(creds.password, 13)
        // setting user password to the hash
    creds.password = hash;
    // grabbing the DB 'users'
    db('users')
        .insert(creds)
        // passing the users registered name/pass 
        .then(added => {
            res.status(201).json(added)
        })
        // succesfully added username/pass
        .catch(err => {
            res.status(400).json(err)
        })
        // error adding username/pass
}



function login(req, res) {
    let { username, password } = req.body;
    // setting the passed in credentials to username/password
    Users.login({ username })
        // using db method to pass username:'login name' 
        .first()
        // grab first element of the array
        .then(user => {
            // returning a promise need .then()/.catch()
            if (user && bcrypt.compareSync(password, user.password)) {
                // if the password matches the hashed password
                const token = generateToken(user)
                    // then generate a token
                res.status(200).json({
                        message: `Welcome ${user.username}`,
                        authToken: token,
                    })
                    // successful request, returns username/token
            } else {
                res.status(401).json({ message: 'Invalid Credentials' })
            }
            // some type of error with the credentials
        })
        .catch(err => {
            res.status(500).json({ err, message: 'Possible mispelling of user/pass or other error' })
        })
        // Internal server error possibly spelling of username or password not credentials
}

function getJokes(req, res) {
    const requestOptions = {
        headers: { accept: 'application/json' },
    };

    axios
        .get('https://icanhazdadjoke.com/search', requestOptions)
        // getting mediocre jokes from api
        .then(response => {
            res.status(200).json(response.data.results);
        })
        .catch(err => {
            res.status(500).json({ message: 'Error Fetching Jokes', error: err });
        });
}