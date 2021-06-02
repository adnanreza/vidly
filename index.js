const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const app = express();
const genres = require('./routes/genres')
const customers = require('./routes/customers')

// Load env vars
dotenv.config({ path: './config.env' });

// Connect to db
connectDB();

// Use middleware that allows parsing incoming reqs with JSON payloads
app.use(express.json());

// Define routes
app.use('/api/genres', genres);
app.use('/api/customers', customers);


const port = process.env.PORT || 5000;
app.listen(port, () => {console.log(`Listening on port ${port}...`)})