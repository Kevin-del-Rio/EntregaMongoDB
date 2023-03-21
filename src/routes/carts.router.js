import { Router } from 'express';
import CartManager from '../dao/db/classModel/cart.js'
import productManager from '../dao/db/classModel/product.js';
import { cartModel } from '../dao/db/models/cartModel.js';

const router = Router();
const cm = new CartManager();
// const pm = new productManager();

// --------------------------------------------------
// AGREGAMOS UN CARRITO
router.post('/', async (req, res) => {
    try {
        let cart = await cm.addCart();
        res.status(201).send("listo")
    }
    catch (e) {
        res.status(500).send({
            status: 'WRONG',
            code: 500,
            message: e.message,
            detail: e.detail
        });
    }
})

// --------------------------------------------------
// AGREGAMOS UN PRODUCTO AL UN CARRITO
router.post("/:cid/product/:pid", async (req,res) => {
    const { cid , pid } = req.params;
    let {quantity} = req.body;
    quantity == undefined ? quantity = 1 : quantity
    try {
        let productAlreadyInCart = await cartModel.find({products: {$elemMatch: {product: pid}}})
        
        let auxCart = await cartModel.findById(cid)
        if (productAlreadyInCart == 0) {
            auxCart.products.push({product:pid, quantity})
            await cartModel.updateOne({_id:cid}, auxCart)
            res.status(200).send("producto agregado por primera vez")
        }else{
            let updateProduct = auxCart.products.filter(oneProd => oneProd.product == pid)
            updateProduct[0].quantity += quantity
            await cartModel.findOneAndUpdate({_id:cid, "products.product": pid}, {$set: {"products.$.quantity": updateProduct[0].quantity }}, { new: true })
            res.status(200).send(`Producto sumo ${quantity}`)
        }

    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

// --------------------------------------------------
// MOSTRAMOS LOS PRODUCTOS DE UN CARRITO SELECCIONADO
router.get('/:cid', async (req, res) => {
    try {
        let id = req.params.cid;
        let cart = await cm.getCartById(id);
        res.status(200).json(cart);
    }
    catch (e) {
        res.status(500).send({
            status: 'WRONG',
            message: e.message,
            detail: e.detail
        });
    }
})
// // MODIFICAMOS UN CARRITO SELECCIONADO
router.put('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        let { newCart }= req.body

        let cart = await cm.updateCartById(cid, newCart);
        res.status(200).send(cart);
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

// BORRRAMOS Todos los producto de UN CARRITO
router.delete('/:cid', async (req, res) => {
    try {
        let id = req.params.cid;
        let cart = await cm.deleteCart(id);
        res.status(200).send({
            status: 'OK',
            message: "Productos del carrito eliminados correctamente",      
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
// BORRRAMOS UN PRODUCTO DEL CARRITO
router.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        await cm.deleteProductCart(cid, pid);
        res.status(201).send({
            status: 'OK',
            message: "Producto eliminado correctamente"
        })
    }
    catch (e) {
        res.status(500).send({
            status: 'WRONG',
            message: e.message,
            detail: e.detail
        });
    }
})

export default router;




// router.post('/:cid/product/:pid', async (req, res) => {
//     try {
//         let cart_id = req.params.cid
//         let product_id = req.params.pid;

//         let product = await pm.getProductById(product_id)
//         if (product.length <= 0) {
//             res.status(500).send("No hay producto con ese id")
//         } else {
//             console.log('producto encontrado')
//             await cm.addProductCart(cart_id, product_id);

//         }
//         res.status(201).send("producto agregado correctamente")
//     }
//     catch (e) {
//         res.status(409).send({
//             status: 'WRONG',
//             code: 409,
//             message: e.message,
//             detail: e.detail
//         });
//     }
// })

// router.post("/:cid/product/:pid", async (req, res) => {
//   try {
//     const { cid, pid } = req.params;
//     idValidator(cid, pid);

//     const cart = await existingCartValidator(cartsManager, cid);
//     const product = await existingProductValidator(productsManager, pid);

//     const index = cart.products.findIndex(
//       (p) => p.product._id.toString() === pid
//     );
//     if (index === -1) cart.products.push({ product: pid });
//     if (index !== -1) cart.products[index].quantity += 1;

//     const response = await cartsManager.addProduct(cid, cart);

//     if (!response)
//       return res
//         .status(400)
//         .send({ status: "error", message: "Error adding product" });

//     res.send({ status: "success", message: "Product added." });
//   } catch (error) {
//     console.log(error);
//     res.status(400).send({ status: "error", message: error.message });
//   }
// });