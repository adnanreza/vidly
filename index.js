const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const app = express();
const genres = require('./routes/genres')
const customers = require('./routes/customers')
const movies = require('./routes/movies')
const rentals = require('./routes/rentals')
const users = require('./routes/users')
const auth = require('./routes/auth')
const error = require('./middleware/error')

// Load env vars
dotenv.config({ path: './config.env' });

if(!process.env.jwtPrivateKey) {
    console.error('FATAL ERROR: jwtPrivateKey is not defined');
    process.exit(1);
}

// Connect to db
connectDB();

// Use middleware that allows parsing incoming reqs with JSON payloads
app.use(express.json());

// Define routes
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);

app.use(error);

const port = process.env.PORT || 5000;
app.listen(port, () => {console.log(`Listening on port ${port}...`)})