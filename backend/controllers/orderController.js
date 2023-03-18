const Orders = require('../models/orders');
const Product = require('../models/product');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

//Create a new order => /order/new
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
    const {
        orderItems,
        shippingInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo
    } = req.body

    const order = await Orders.create({
        orderItems,
        shippingInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user: req.user._id
    })
    res.status(200).json({
        success: true,
        order
    })
})

//Get Single order => /order/:id
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Orders.findById(req.params.id).populate('user', 'name email')

    if (!order) {
        return next(new ErrorHandler('No order found with this ID', 404))
    }
    res.status(200).json({
        success: true,
        order
    })
})

//get logged in user orders => /orders/me
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Orders.find({user:req.user.id})

    if (!orders) {
        return next(new ErrorHandler('No order found with this ID', 404))
    }
    res.status(200).json({
        success: true,
        orders
    })
})

//get all orders => /admin/orders -ADMIN
exports.allOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Orders.find()

  let totalAmount = 0;
  orders.forEach(order => {
    totalAmount+=order.totalPrice
  })
    res.status(200).json({
        success: true,
        totalAmount,
        orders
    })
})


//update /Process orders -ADMIN => /admin/order/:id
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Orders.findById(req.params.id)
    console.log(order)
    if(order.orderStatus==='Delivered') {
        return next(new ErrorHandler('You have alredy delivered this order',400))
    }

    order.orderItems.forEach(async item => {
        console.log("item------------")
        console.log(item.product)
        console.log(item.quantity)
        await updateStock(item.product,item.quantity)
    })

    order.orderStatus=req.body.status,
    order.delivered = Date.now()
    await order.save()

    res.status(200).json({
        success: true
    })
})

async function updateStock(id, quantity) {
    const product = await Product.findById(id)
    console.log(product)
    product.stock =product.stock- quantity

    await product.save({validateBeforeSave:false})
}


//Delete order => /admin/order/:id
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Orders.findById(req.params.id).populate('user', 'name email')

    if (!order) {
        return next(new ErrorHandler('No order found with this ID', 404))
    }
    await order.remove()
    res.status(200).json({
        success: true
    })
})  

