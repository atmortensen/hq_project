require('dotenv').config()
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const db = require('./db_connect')
const jwt = require('jsonwebtoken')

module.exports = {}

// Google Passport Strategy
passport.use(new GoogleStrategy({
	clientID: process.env.GOOGLE_CLIENT_ID,
	clientSecret: process.env.GOOGLE_CLIENT_SECRET,
	callbackURL: process.env.GOOGLE_CALLBACK_URL
}, (accessToken, refreshToken, profile, cb) => {
	return cb(null, profile)
}))

// Authentication Middleware
module.exports.authenticate = passport.authenticate('google', { session: false, scope: ['email'] })

// Sign Up or Sign In
module.exports.signIn = (req, res) => {

	const redirect = (id) => {
		const frontEndUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000/' : '/'
		const tempToken = jwt.sign({ id: id }, process.env.JWT_SECRET, { expiresIn: 60 })
		res.redirect(`${ frontEndUrl }social-login-success?temp=${ tempToken }`)
	}

	const signIn = (existingUser) => {
		if (!existingUser.google_id) {
			db.query('UPDATE users SET google_id = $1 WHERE id = $2', [ req.user.id, existingUser.id ]).then(() => {
				redirect(existingUser.id)
			})
		} else {
			redirect(existingUser.id)
		}
	}
	
	const signUp = () => {
		db.query(
			'INSERT INTO users (email, google_id, name) VALUES ($1, $2, $3) RETURNING id', 
			[ req.user.emails[0].value, req.user.id, req.user.displayName ]
		).then(({ rows }) => {
			redirect(rows[0].id)
		}).catch(() => res.json({ error: 'Server error.' }))
	}

	db.query('SELECT * FROM users WHERE email = $1 AND archived IS NULL', [req.user.emails[0].value]).then(({ rows }) => {
		const existingUser = rows[0]
		if (existingUser) {
			signIn(existingUser)
		} else {
			signUp()
		}
	}).catch(() => res.json({ error: 'Server error.' }))

}
