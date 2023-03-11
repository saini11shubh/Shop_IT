const express = require('express')
const router = express.Router();

const { getProducts,
    newProduct,
    getSingleProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController')

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth')

// console.log("hellop")
router.route('/products').get(getProducts);
// router.route('/product/new').post(newProduct);
router.post("/admin/products/new", isAuthenticatedUser, authorizeRoles('admin'), newProduct);

router.get('/products/:id', getSingleProduct);

router.put('/admin/products/:id', isAuthenticatedUser, authorizeRoles('admin'), updateProduct);

router.delete('/admin/products/:id', isAuthenticatedUser, authorizeRoles('admin'), deleteProduct);

module.exports = router;  