const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({
        message: 'orders were fetched'
    });
});

router.post('/', (req, res) => {
    res.status(201).json({
        message: 'order was created'
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