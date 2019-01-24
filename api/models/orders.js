const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true},//connect reference to Product model
    quantity:{type: Number, default: 1}
})

module.exports = mongoose.model('Order',orderSchema)