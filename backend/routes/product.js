const express = require('express')
const router = express.Router();

const { getProducts,
    newProduct,
    getSingleProduct,
    updateProduct,  
    deleteProduct } = require('../controllers/productController')


router.route('/products').get(getProducts);
// router.route('/product/new').post(newProduct);
router.post("/admin/products/new", newProduct);

router.get('/products/:id', getSingleProduct);

router.put('/admin/products/:id', updateProduct);

router.delete('/admin/products/:id', deleteProduct);

module.exports = router;