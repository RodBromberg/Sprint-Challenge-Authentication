const jwt = require("jsonwebtoken");

const secrets = require("./secrets.js");
// importing our secret that were passing 
module.exports = {
    generateToken
};
// exporting our function

function generateToken(user) {
    const payload = {
        subject: user.id,
        username: user.username
            // only for basic info publicly visible describing
    }
    const options = {
            expiresIn: '8h',
        }
        // time for the token to maintain authentication 
        // can add other options to token
    return jwt.sign(payload, secrets.jwtSecret, options)

    // gets the payload/data and also the secret
    // secret used to decrypt/encrypt
}