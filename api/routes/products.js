const express = require('express');
const router = express.Router();

router.get('/', (request, response) => {
    response.status(200).json({
        message: 'Handling GET requests to /products'
    });
});

router.post('/', (req,res) => {
    res.status(201).json({
        message: 'handling post requests to /products'
    });
});

router.get('/:productId', (req,res) => {
    const id = req.params.productId;
    if (id == 'special'){
        res.status(200).json({
            message: 'you discovered the special id',
            id: id
        });
    }else{
        res.status(200).json({
            message: 'you passed an ID'
        })
    }
})

router.patch('/:productId', (req,res) => {
    res.status(200).json({
        message: 'updated product'
    });
})

router.delete('/:productId', (req,res) => {
    res.status(200).json({
        message: 'deleted product'
    });
})

module.exports = router;