const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please Enter product name'],
        trim: true,
        maxLength: [100, 'Product name cannot exceed 100 charactera']
    },
    price: {
        type: Number,
        required: [true, 'Please Enter product Price'],
        maxLength: [5, 'Product name cannot exceed 5 charactera'],
        default: 0.0
    },
    description: {
        type: String,
        required: [true, 'Please Enter product description']
    },
    ratings: {
        type: Number,
        default: 0
    },
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            },
        }
    ],
    catergory: {
        type: String,
        required: [true, 'Plese select category for this product'],
        enum: {
            values: [
                'Electronics',
                'Cameras',
                'Laptop',
                'Accessories',
                'headphones',
                'Food',
                'Books',
                'Clothes/Shoes',
                'Beauty/Health',
                'Sports',
                'Outdoor',
                'Home'
            ],
            message: 'Please select correct category for product'
        }
    },
    seller: {
        type: String,
        required: [true, 'plese enter product seller']
    },
    stock: {
        type: Number,
        required: [true, 'Plese enter product stock'],
        maxLength: [5, 'Product name cannot exceed 5 characters']
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            name: {
                type: String,
                required: true
            }
        }
    ],

    user: {
        // type: mongoose.Schema.Types.ObjectId,
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})
module.exports = new mongoose.model("Product", productSchema)