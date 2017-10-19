const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const authentication = require('./modules/authentication')

require('dotenv').config()
app.use(bodyParser.json())
app.use(express.static(__dirname + '/front_end/build'))

app.post('/api/sign-in')
app.post('/api/sign-up')

app.get('/api/user/:id')
app.put('/api/user/:id')
app.delete('/api/user/:id')

app.listen(process.env.PORT, () => {
	console.log('Listening on port ' + process.env.PORT)
})
