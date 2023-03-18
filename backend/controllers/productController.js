const Product = require('../models/product');
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const APIFeatures = require('../utils/apiFeatures')

exports.newProduct = async (req, res, next) => {
    console.log('Product');
    console.log(req.user.id);
    req.body.user = req.user.id;

    console.log(req.body.user);
    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product
    })
}

//Get all products => /api/v1/products
exports.getProducts = catchAsyncErrors(async (req, res, next) => {
    console.log("kkkkkkkkkk");
    const resPerPage = 4;
    const productCount = await Product.countDocuments();
    console.log(productCount);
    const apiFeatures = new APIFeatures(Product.find(), req.query).search().filter().pagination(resPerPage)
    console.log(apiFeatures);
    const products = await Product.find();
    res.status(200).json({
        status: true,
        message: "This route will show all products in database.",
        productCount,
        products
    })
})

//Get single products details= /api/v1/product/:id
exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler('Product not found', 404));
    }
    res.status(200).json({
        success: true,
        message: 'Product found',
        product

    })
})

//Get single products details= /api/v1/product/:id
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    // console.log(product)
    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        })
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });
    console.log(product)
    return res.status(200).json({
        success: true,
        message: 'Product found',
        product
    })
})

//Get single products details= /api/v1/admin/product/:id
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    // console.log(product)
    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        })
    }

    await product.remove();
    return res.status(200).json({
        success: true,
        message: 'Data Deleted',
        product
    })
})

//create new review  =>  /review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }
    console.log(review)
    const product = await Product.findById(productId);
    console.log(product)
    const isReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString())
    console.log("---------------")
    console.log(isReviewed)
    console.log("---------------")
    console.log(product.reviews.length)
    if (isReviewed) {
        product.reviews.forEach(review => {
            if (review.user.toString() === req.user._id.toString()) {
                review.comment = comment;
                review.rating = rating;
            }
        })
    }
    else {
        product.reviews.push(review);
        product.numofReviews = product.reviews.length
    }

    //calculate overall rating
    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length
    console.log("================product rating==========")
    console.log(product.ratings)
    await product.save({ validateBeforesave: false })

    res.status(200).json({
        success: true
    })
})

//Get product reviews => /reviews
exports.getProductsReviews = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);

    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
})

//Get product reviews => /deleteReview
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);

    const reviews = product.reviews.filter(review => review._id.toString() !== req.query.id.toString());

    const numOfReviews = reviews.length;

    const ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length
    console.log("================product");
    console.log(product);
    console.log(ratings);
    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
})