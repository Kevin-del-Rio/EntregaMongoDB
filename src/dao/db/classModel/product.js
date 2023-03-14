// import mongoose from "mongoose";
import { productModel } from "../models/productModel.js";


class productManager {
    constructor() {}
    getProduct = async () => {
        try {
            let product = await productModel.find();
            return product
        } catch (error) {
            console.error("Error al traer los productos desde classModel ", error)
        }
    };

    addProduct = async ({ title, description, price, thumbnail, stock, category }) => {
        try {
            let code = Math.random().toString(30).substring(2);
            let nprod = {
                title,
                description,
                price,
                thumbnail,
                status: true,
                stock,
                category,
                code
            }
            await productModel.create(nprod)

        } catch (error) {
            console.log(`Error al agregar producto: ${error}`);
        }
    }
    getProductById = async (id) => {

        let prod = await productModel.findById({ _id: id })
        return prod
            ? prod
            : console.error(`Producto con id: ${id} no encontrado.`, ' “Not found” ');
    };
    deleteProduct = async (id) => {
        try {
            await productModel.findByIdAndDelete({ _id: id })
            return { status: "success" };
        } catch (error) {
            console.error(`Error al borrar producto: ${error}`);
            return { status: "error", error: error.message };
        }

    };

    updateProductById = async (id, nuevoProducto) => {
        try {
            await productModel.findByIdAndUpdate(
                id,
                nuevoProducto,
                { useFindAndModify: false }
            )
        } catch (error) {
            console.error("Error al actuadizar un productos", error)
        };
    };
}

export default productManager;