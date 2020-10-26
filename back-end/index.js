/**
 * index.js Created by Santhosh Kumar, Krishnan on 1/29/2020
 */
const express = require('express');
const bodyParser = require('body-parser');
// const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config')

const product = require('./routes/product.route'); // Imports routes for the products
// initialize our express app
const app = express();
const port = config.PORT || 9090

// set up mongoose connection
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.connect(config.DB_URL, config.options)
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.once("open", () => console.log("Connected to the database"));
// checks if connection with the database is successful
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(cors());
// app.use(fileUpload());
app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use('/products', product);

app.listen(port, () => {
    console.log('Server is up and running on port numner ' + port);
})
