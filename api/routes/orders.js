const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/orders');

router.get('/', (req, res) => {
    Order.find()
    .select('product quantity _id')
    .exec()
    .then(docs => {
        res.status(200).json({
            count: docs.length,
            orders: docs.map(doc => {
                return {
                    _id: doc._id,
                    product: doc.product,
                    quantity: doc.quantity,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:5000/orders/' + doc._id
                    }
                }
            })
            
        });
    })
    .catch(err => {
        console.log(error);
        res.status(500).json({
            error: err
        })
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
        res.status(201).json({
            message: 'Order stored',
            request: {
                type: 'GET',
                createdOrder: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
                },
                url: 'http://localhost:5000/orders/' + doc._id
            }
        })
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