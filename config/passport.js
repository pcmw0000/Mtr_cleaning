require('dotenv').config();
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/User');

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
    issuer: 'yourIssuer',
    audience: 'yourAudience',
    algorithms: ['HS256']
};

module.exports = (passport) => {
    passport.use(new JwtStrategy(options, (jwt_payload, done) => {
        User.findById(jwt_payload.id)
            .then(user => {
                if (!user) {
                    return done(null, false, { message: 'User not found' });
                }
                return done(null, user);
            })
            .catch(err => {
                console.error("Error during user fetching: ", err);
                return done(err, false);
            });
    }));
};