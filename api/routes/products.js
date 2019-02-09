const express = require('express');
const router = express.Router();
const Product = require('../models/products');
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const storage = multer.diskStorage({
    destination: function(request, file, callback){
        callback(null, './uploads/');
    },
    filename: function(request, file, callback){
        callback(null, new Date().toISOString() + file.originalname);
    }
});

//only mimetypes
const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype == 'image/png'){
        //accept the file
        cb(null,true);
    }
    else{
        //reject a file
        cb(null,false);
    }
};

//multer will stored incoming files
//add limit restriction
const upload = multer({
    storage: storage, 
    limits: { 
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
}); 

router.get('/', (req, res,next) => {
    Product.find()
    .select("name price _id productImage")
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            products: docs.map(doc => {
                return{
                    name: doc.name,
                    price: doc.price,
                    productImage: doc.productImage,
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

//upload - only get one file
router.post('/', checkAuth, upload.single('productImage') , (req,res,next) => {

    //req.file is from upload.single
    console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId,
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
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
                    url: 'http://localhost:5000/products/' + result._id
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
    .select('name price _id productImage')
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
        res.status(200).json({
            message: "product updated",
            request: {
                type: 'GET',
                url: 'http://localhost:5000/products/' + result._id
            }
        });
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