const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1
                }
            }
        ],
        default: []
    }
},
    {
        timestamps: true,
    });

//Se hace un populate de los productos en find y findById
cartSchema.pre('find', function() {
    this.populate('products.product');
});
cartSchema.pre('findOne', function() {
    this.populate('products.product');
});
cartSchema.pre('findById', function() {
    this.populate('products.product');
});

module.exports = mongoose.model('Cart', cartSchema);