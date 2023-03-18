const express = require('express')
const router = express.Router();

const { getProducts,
    newProduct,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    createProductReview,getProductsReviews,deleteReview
} = require('../controllers/productController')

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth')

// console.log("hellop")
router.route('/products').get(getProducts);
// router.route('/product/new').post(newProduct);
router.post("/admin/products/new", isAuthenticatedUser, authorizeRoles('admin'), newProduct);

router.get('/products/:id', getSingleProduct);

router.put('/admin/products/:id', isAuthenticatedUser, authorizeRoles('admin'), updateProduct);

router.delete('/admin/products/:id', isAuthenticatedUser, authorizeRoles('admin'), deleteProduct);

router.put('/review', isAuthenticatedUser, createProductReview);

router.get('/reviews', isAuthenticatedUser, getProductsReviews);

router.delete('/deleteReview', isAuthenticatedUser, deleteReview);

module.exports = router;  