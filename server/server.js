const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('../api/routes/products');
const orderRoutes = require('../api/routes/orders');
const userRoutes = require('../api/routes/user');

require('dotenv').config();
const DBUSER = process.env.DBUSER;
const DBPASSWORD = process.env.DBPASSWORD;

mongoose.connect(`mongodb://${DBUSER}:${DBPASSWORD}@ds261114.mlab.com:61114/node_rest`,{ useNewUrlParser: true });

app.use(morgan('dev'));

//makes uploads folder available public
//e.g localhost:3000/uploads/image_name
app.use('/uploads/',express.static('uploads')); 
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//CORS - prevent error 
app.use((req, res,next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    if (req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({})
    }
    next();
})

//routes which should handle requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/users', userRoutes);

//catch all error requests or other
app.use((req,res,next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error,req,res,next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;
