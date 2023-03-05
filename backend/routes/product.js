const express = require('express')
const router = express.Router();

const { getProducts,
    newProduct,
    getSingleProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController')

const { isAuthenticatedUser } = require('../middlewares/auth')

// console.log("hellop")
router.route('/products').get(isAuthenticatedUser, getProducts);
// router.route('/product/new').post(newProduct);
router.post("/admin/products/new", isAuthenticatedUser, newProduct);

router.get('/products/:id', getSingleProduct);

router.put('/admin/products/:id', isAuthenticatedUser, updateProduct);

router.delete('/admin/products/:id', isAuthenticatedUser, deleteProduct);

module.exports = router;