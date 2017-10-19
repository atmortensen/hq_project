const db = require('./db_connect')
require('dotenv').config()

// Sign In

// Sign Up

// Auth Middleware

db.query(`
	DROP TABLE IF EXISTS users;
	CREATE TABLE users (
		id SERIAL PRIMARY KEY NOT NULL,
		password TEXT NOT NULL,
		email TEXT NOT NULL,
		archived BOOLEAN DEFAULT false NOT NULL
	)
`)
