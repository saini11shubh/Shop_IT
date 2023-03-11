const Product = require('../models/product');
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const APIFeatures = require('../utils/apiFeatures')

exports.newProduct = async (req, res, next) => {
    console.log('Product');
    console.log(req.user.id);
    req.body.user=req.user.id;
    
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