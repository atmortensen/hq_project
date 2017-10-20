require('dotenv').config()
const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy
const db = require('./db_connect')
const jwt = require('jsonwebtoken')

module.exports = {}

// Facebook Passport Strategy
passport.use(new FacebookStrategy({
	clientID: process.env.FACEBOOK_CLIENT_ID,
	clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
	callbackURL: process.env.FACEBOOK_CALLBACK_URL,
	profileFields: [ 'displayName', 'email', 'id' ]
}, (accessToken, refreshToken, profile, cb) => {
	return cb(null, profile._json)
}))

// Authentication Middleware
module.exports.authenticate = passport.authenticate('facebook', { session: false, scope: ['email'] })

// Sign Up or Sign In
module.exports.signIn = (req, res) => {
	
	const redirect = (id) => {
		const frontEndUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000/' : '/'
		const tempToken = jwt.sign({ id: id }, process.env.JWT_SECRET, { expiresIn: 60 })
		res.redirect(`${ frontEndUrl }social-login-success?temp=${ tempToken }`)
	}

	const signIn = (existingUser) => {
		if (!existingUser.facebook_id) {
			db.query('UPDATE users SET facebook_id = $1 WHERE id = $2', [ req.user.id, existingUser.id ]).then(() => {
				redirect(existingUser.id)
			})
		} else {
			redirect(existingUser.id)
		}
	}
	
	const signUp = () => {
		db.query(
			'INSERT INTO users (email, facebook_id, name) VALUES ($1, $2, $3) RETURNING id', 
			[ req.user.email, req.user.id, req.user.name ]
		).then(({ rows }) => {
			redirect(rows[0].id)
		}).catch(() => res.json({ error: 'Server error.' }))
	}

	db.query('SELECT * FROM users WHERE email = $1 AND archived IS NULL', [req.user.email]).then(({ rows }) => {
		const existingUser = rows[0]
		if (existingUser) {
			signIn(existingUser)
		} else {
			signUp()
		}
	}).catch(() => res.json({ error: 'Server error.' }))

}
