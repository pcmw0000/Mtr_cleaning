require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require("express-rate-limit");
const passport = require('passport');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(express.static('public'));

if (!process.env.JWT_SECRET) {
  console.error('Critical error: JWT_SECRET is not defined.');
  process.exit(1);  // exit
}

// Logger
app.use(morgan('combined'));

// CORS configuration
const corsOptions = {
    origin: process.env.CORS_ORIGIN || 'https://example.com',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
};
app.use(cors(corsOptions));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routers
const usersRouter = require('./routes/users');
const itemsRouter = require('./routes/items');
app.use('/users', usersRouter);
app.use('/items', itemsRouter);
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Passport middleware
require('./config/passport')(passport);
app.use(passport.initialize());

// Check for SECRET_KEY
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    console.error("No Secret Key set.");
    process.exit(1);
}

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/myplatform')
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch(err => {
        console.error("MongoDB connection error: " + err.message);
        process.exit(1);
    });

// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.stack);
    res.status(statusCode).send({
        error: {
            status: statusCode,
            message: err.message || 'Internal Server Error',
        },
    });
});

// Server listening
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});