import express from "express";
import productManager from "../dao/db/classModel/product.js";
import CartManager from "../dao/db/classModel/cart.js";


const router = express.Router()
const pm = new productManager();
const cm = new CartManager()


// router.get("/", async (req, res) => {
//   try {
//     const products = await pm.getProduct()
//     console.log(products)
//     res.render("home", { products });
//   } catch (error) {
//     console.log(error);
//   }
// });

// router.get("/realtimeproducts", async (req, res) => {
//   try {
//     const products = await pm.getProduct()
//     console.log(products)
//     res.render("realTimeProducts",  {products} );
//   } catch (error) {
//     console.log(error);
//   }
// });

// router.get("/products/", async (req, res) => {
//   try {
//     let { limit = 10, page = 1, query = "", sort = "" } = req.query;
//     if (query) query = JSON.parse(query);
//     if (sort) sort = { price: sort };

//     const response = await pm.getPaginate(
//       limit,
//       page,
//       query,
//       sort
//     );
//     res.render("products", { response });
//   } catch (error) {
//     console.log(error);
//     res.status(400).send({ status: "error", message: error.message });
//   }
// });

// router.get("/products/:pid", async (req, res) => {
//   try {
//     const { pid } = req.params;    
//     const product = await pm.getProductById(pid)
//     res.render("productDetail", product);
//   } catch (error) {
//     res.status(400).send({ status: "error", message: error.message });
//   }
// });

// router.get("/carts/:cid", async (req, res) => {
//   try {
//     const { cid } = req.params;  

//     const cart = await cm.getCartById(cid)

//     res.render("cart", cart);
//   } catch (error) {
//     console.log(error);
//     res.status(400).send({ status: "error", message: error.message });
//   }
// });

  
//   router.get("/chats", (req, res) => {
//     res.render("chats");
// })


export default router;