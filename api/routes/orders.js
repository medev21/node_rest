const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/orders');
const Product = require('../models/products');
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
    Product.findById(req.body.productId)
    .then(product => {
        if(!product){
            return res.status(404).json({
                message: "product not found"
            })
            //all subsequent code will not be processed if return is executed
        }
        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productId
        });
        return order.save();
    })
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
                url: 'http://localhost:5000/orders/' + result._id
            }
        })
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            error: err
        })
    })
    
})

router.get('/:orderId', (req,res) => {
    Order.findById(request.params.orderId)
    .exec()
    .then(order => {
        if(!order){
            return res.status(404).json({
                message: "Order not found"
            });
        }
        res.status(200).json({
            order: order,
            request: {
                type: 'GET',
                url: 'http://localhost:5000/orders/'
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    })
});

router.delete('/:orderId', (req,res) => {
    Order.deleteOne({_id: req.params.orderId})
    .exec()
    .then(result => {
        res.status(200).json({
            message: "order deleted",
            request: {
                type: 'POST',
                url: "http://localhost:5000/orders/",
                body: {productId: "ID", quantity: "Number"}
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    });
});

module.exports = router;