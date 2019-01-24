const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/orders');

router.get('/', (req, res) => {
    res.status(200).json({
        message: 'orders were fetched'
    });
});

router.post('/', (req, res, next) => {
    const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId
    });
    order.save()
    .then(result => {
        console.log(result);
        res.status(201).json(result)
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            error: err
        })
    });
})

router.get('/:orderId', (req,res) => {
    res.status(200).json({
        message: 'order is fetched',
        orderId: req.params.orderId
    })
});

router.delete('/:orderId', (req,res) => {
    res.status(200).json({
        message: 'order is deleted',
        orderId: req.params.orderId
    })
});

module.exports = router;