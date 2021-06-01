const express = require('express');
const dotenv = require('dotenv');
const app = express();
const genres = require('./routes/genres')

// Load env vars
dotenv.config({ path: './config.env' });

// Use middleware that allows parsing incoming reqs with JSON payloads
app.use(express.json());

// Define routes
app.use('/api/genres', genres);

const port = process.env.PORT || 5000;
app.listen(port, () => {console.log(`Listening on port ${port}...`)})