import { Router } from 'express';
// import CartManager from '../dao/filesystem/models/cartModel.js'
// import productManager from '../dao/filesystem/models/productModel.js';

import CartManager from '../dao/db/classModel/cart.js'
import productManager from '../dao/db/classModel/product.js';


const router = Router();
const cm = new CartManager();
const pm = new productManager();

// --------------------------------------------------
// AGREGAMOS UN CARRITO
router.post('/', async (req, res) => {
    let cart = req.body.products;
    try {
        await cm.addCart(cart);
        res.send(cart);
    }
    catch (e) {
        res.status(409).send({
            status: 'WRONG',
            code: 409,
            message: e.message,
            detail: e.detail
        });
    }
})

// --------------------------------------------------
// AGREGAMOS UN PRODUCTO AL UN CARRITO
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        let cart_id =  req.params.cid
        let product_id =  req.params.pid;

        let product = await pm.getProductById(product_id) 
              console.log(product)
        if (product.length <= 0) {
            console.log("no hay producto")
            res.status(500).send("No hay producto con ese id")
        } else {
            console.log('producto encontrado')
            await cm.addProductCart(cart_id, product_id);
            res.status(200).send("producto agregado correctamente")
        }    

    }
    catch (e) {
        res.status(409).send({
            status: 'WRONG',
            code: 409,
            message: e.message,
            detail: e.detail
        });
    }
})
// --------------------------------------------------
// MOSTRAMOS LOS PRODUCTOS DE UN CARRITO SELECCIONADO
router.get('/:cid', async (req, res) => {
    try {
        let id = req.params.cid;
        let cart = await cm.getCartById(id);
        res.send(cart);
    }
    catch (e) {
        res.status(e.code ? e.code : 500).send({
            status: 'WRONG',
            code: e.code,
            message: e.message,
            detail: e.detail
        });
    }
})

// BORRRAMOS UN CARRITO
router.delete('/:cid', async (req, res) => {
    try {
        let id = req.params.cid;
        let cart = await cm.deleteCart(id);
        res.status(200).send({
            status: 'OK',
            message: "Carrito eliminado correctamente",
            data: { id: id, cart: cart }
        })
    }
    catch (e) {
        res.status(e.code ? e.code : 500).send({
            status: 'WRONG',
            code: e.code,
            message: e.message,
            detail: e.detail
        });
    }
})

export default router;
