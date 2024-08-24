const JWT = require('jsonwebtoken');
const secretKey = 'MacIntosh17.4';

function generateToken(user){ //generate a token using user object as payload and secretKey.
    const payload = {
        _id: user._id,
        email: user.email,
        profileImageURL: user.profileImageURL,
        role: user.role,
    };
    const token = JWT.sign(payload, secretKey, {expiresIn: '1h'});
    return token
}

function verifyToken(token){ //verify the token using the secretKey.
    const userData = JWT.verify(token, secretKey);
    return userData;
}


module.exports = {
    generateToken,
    verifyToken,
};