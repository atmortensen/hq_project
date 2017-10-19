require('dotenv').config()
const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy

module.exports = {}

passport.use(new FacebookStrategy({
	clientID: process.env.FACEBOOK_CLIENT_ID,
	clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
	callbackURL: process.env.FACEBOOK_CALLBACK_URL,
	profileFields: [ 'displayName', 'email', 'id' ]
}, (accessToken, refreshToken, profile, cb) => {
	return cb(null, profile._json)
}))

module.exports.authenticate = passport.authenticate('facebook', { session: false, scope: ['email'] })

module.exports.login = (req, res) => {
	console.log(req.user)
	res.send()
}
