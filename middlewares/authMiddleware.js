const { verifyToken } = require('../utility/authUtility');

function verifyAuthentication(cookieName) {
    return (req,res,next) =>{
        const tokenCookieValue = req.cookies[cookieName]; //get the value of the cookie with the name 'tokenCookieValue'.
        if(!tokenCookieValue) {
          return next();
        }//if the cookie is not present, then return unauthorized access.

        try{
            const userPayload = verifyToken(tokenCookieValue); //verify the token and get the user payload.
            req.user = userPayload; //set the user payload in the request object.
            res.locals.user = userPayload; // Add user data to locals so it's available in views
        } catch(err){
             if (err.name === 'TokenExpiredError') {
                console.error('Token expired:', err);
                return res.redirect('/user/login');
            }//if the token is expired, then redirect to the login page.
            console.error('Token verification failed:', err);
        }//if the token is not verified, then return next().

    return next();
    };
}

module.exports = {
    verifyAuthentication,
};