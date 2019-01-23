const express = require('express');
const router = express.Router();
const Product = require('../models/products');
const mongoose = require('mongoose');

router.get('/', (req, res,next) => {
    Product.find()
    .select("name price _id")
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            products: docs.map(doc => {
                return{
                    name: doc.name,
                    price: doc.price,
                    _id: doc._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:5000/products/' + doc._id
                    }
                }
            })
        }
        // if(docs.length > 0){
            res.status(200).json(response);
        // }
        // else{
        //     res.status(404).json({
        //         message: 'No entries found'
        //     })
        // }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

router.post('/', (req,res,next) => {

    const product = new Product({
        _id: new mongoose.Types.ObjectId,
        name: req.body.name,
        price: req.body.price
    })

    product.save()
    .then(result => {
        console.log(result)
        res.status(201).json({
            message: 'Created product successfully',
            createdProduct: {
                name: result.name,
                price: result.price,
                _id: result._id,
                request: {
                    type: 'GET',
                    url: 'http://localhost:5000/products/' + doc._id
                }
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

router.get('/:productId', (req,res) => {
    const id = req.params.productId;
    Product.findById(id)
    .select('name price _id')
    .exec()
    .then(doc => {
        console.log(doc);
        if(doc){
            res.status(200).json({
                product: doc,
                request: {
                    type: 'GET',
                    url: 'http://localhost:5000/products'
                }
            });            
        }else{
            res.status(404).json({message: 'no valid entry for provided id'});
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
})

router.patch('/:productId', (req,res) => {
    const id = req.params.productId;
    const updateOps = {};
    //assuming req.body is an array
    for(const ops of req.body){
        updateOps[ops.propsName] = ops.value;
    }
    Product.updateOne({_id: id}, {$set: updateOps})
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
})

router.delete('/:productId', (req,res) => {
    const id = req.params.productId;
    Product.deleteOne({_id: id})
    .exec()
    .then(result => {
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
})

module.exports = router;