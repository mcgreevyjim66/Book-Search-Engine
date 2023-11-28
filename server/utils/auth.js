const jwt = require('jsonwebtoken');

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  // function for our authenticated routes
  authMiddleware: function ({ req }) {
    console.log("auth.js authMiddleware enter")
    let token = req.body.token  || req.query.token || req.headers.authorization;
    // ["Bearer", "<tokenvalue>"]
    console.log("auth.js authMiddleware afteer let token")
    if (req.headers.authorization) {
      console.log("auth.js authMiddleware if haeders.auth")
      token = token.split(' ').pop().trim();
    }
    if (!token) {
      console.log("auth.js authMiddleware if !token")
      return req;
    }
    try {
      console.log("auth.js auth middle try enter")
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      console.log("auth.js auth middle try after verify")
      req.user = data;
      console.log("server auth.js req:" + req)
      console.log("server auth.js req.user:" + req.user)
    } catch {
      console.log('Invalid token');
    }
    return req;
  },
  authMiddlewarex: function (req, res, next) {
    // allows token to be sent via  req.query or headers
    let token =  req.query.token || req.headers.authorization;

    // ["Bearer", "<tokenvalue>"]
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    if (!token) {
      // return console.error({ message: "invalid token!" });
      return console.error({ message: "invalid token!" });
    }

    // verify token and get user data out of it
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log('Invalid token');
      return res.status(400).json({ message: 'invalid token!' });
    }

    // send to next endpoint
    next();
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
