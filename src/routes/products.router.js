import { Router } from 'express';
import productManager from "../dao/db/classModel/product.js"
import { productModel } from '../dao/db/models/productModel.js';

const router = Router();
const pm = new productManager();


// MOSTAR TODOS LOS PRODUCTOS
router.get('/', async (req,res) => {
    let { limit , page , sort , query } = req.query;
    let result = {}
    
    try {
        let queryObj = JSON.parse(query ? query : "{}")
        let resultQuery = await productModel.paginate(queryObj ? queryObj : {}, { limit: (limit ? limit : 10) , page: (page ? page : 1) , sort: {price: (sort ? sort : 1 )}})
        result = {
            status: "success",
            payload: resultQuery.docs,
            totalPages: resultQuery.totalPages,
            prevPage: resultQuery?.prevPage || null,
            nextPage: resultQuery?.nextPage || null,
            page: resultQuery.page,
            hasPrevPage: resultQuery?.hasPrevPage,
            hasNextPage: resultQuery?.hasNextPage,
            prevLink: resultQuery?.hasPrevPage != false  ? `http://localhost:8080/api/products?limit=${(limit ? limit : 10)}&page=${parseInt((page ? page : 1))-1}&query=${query ? query : "{}"}&sort=${(sort ? sort : 1 )}` : null ,
            nextLink: resultQuery?.hasNextPage != false ? `http://localhost:8080/api/products?limit=${(limit ? limit : 10)}&page=${parseInt((page ? page : 1))+1}&query=${query ? query : "{}"}&sort=${(sort ? sort : 1 )}` : null
        }
        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({status: "error" , message: error.message});
    }
});

router.get('/query', async (req, res) => {
    try {
        let products = await pm.getProduct()
        let limit = req.query.limit;
        if (limit > 0) {
            let prod = products.slice(0, limit)
            res.send(JSON.stringify(prod));
        } else {
            res.send(JSON.stringify(products))
        }
    }
    catch (e) {
        res.status(404).send({
            status: 'WRONG',
            code: 409,
            message: e.message,
            detail: e.detail
        });
    }
});

// MOSTRAR UN PRODUCTO
router.get('/:pid', async (req, res) => {
    try {
        let id = await req.params.pid;
        let product = await pm.getProductById(id)
        res.status(200).send(product);
    }
    catch (e) {
        res.status(404).send({
            status: 'WRONG',
            code: e.code,
            message: e.message,
            detail: e.detail
        });
    }
})
// // AGREGAR UN PRODUCTO
router.post("/", async (req, res) => {
    try {
        const product = req.body;
        const response = await pm.addProduct(product);
        res.send({ status: "success", message: "Product added" });
    } catch (error) {
        console.log(error);
    }
});
// // ACTUALIZAR UN PRODUCTO
router.put('/:id', async (req, res) => {
    let id = await req.params.id
    let updateProd = req.body;

    try {
        await pm.updateProductById(id, updateProd)
        res.status(200).send({
            status: 'OK',
            message: "Producto actualizado correctamente",
            data: updateProd
        })
    }
    catch (e) {
        res.status(409).send({
            message: "Producto no se pudo actualizar",
            data: updateProd
        })
    }
})
// // BORRAR UN PRODUCTO
router.delete('/:id', async (req, res) => {
    let ids = req.params.id;
    try {
        await pm.deleteProduct(ids);
        return res.send({ status: "success", message: "Product delete" });
    }
    catch (e) {
        res.status(409).send({
            status: 'WRONG',
            message: e.message,
            detail: e.detail,
            data: { id: id }
        })
    }

})

export default router;
