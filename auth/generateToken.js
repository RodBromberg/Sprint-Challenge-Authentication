const jwt = require("jsonwebtoken");

const secrets = require("./secrets.js");

module.exports = {
    generateToken
};

function generateToken(user) {
    const payload = {
        userId: user.id,
        username: user.username
            // ...other data

    }
    const options = {
        expiresIn: '8h',
    }

    return jwt.sign(payload, secrets.jwtSecret, options)
}