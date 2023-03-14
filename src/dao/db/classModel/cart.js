import { cartModel } from "../models/cartModel.js";

class CartManager{
    constructor(){}


    addCart = async(product)=>{
        try {
             await cartModel.create(product)
        } catch (error) {
            console.error("No se pudo crear el carrito desde mongoDB", error)
        }
       
    };

    getCartById = async (id) => {
        let prod = await cartModel.findById({ _id: id })
        return prod
            ? prod
            : console.error(`Producto con id: ${id} no encontrado.`, ' “Not found” ');
    };


    addProductCart = async(cid, pid)=>{
        try {        
            let auxCart = await this.getCartById(cid);          
            if (auxCart.products.length === 0) {
                let product = []
                product.push({_id: pid, quantity: 1})
                await cartModel.updateOne({_id:cid}, {products: product});
            }else{
                let products = [];
                let updateProduct = auxCart.products.filter(oneProd => oneProd._id === pid) 
                let newQuantity = 1;
                if (updateProduct.length > 0) {
                    newQuantity = parseInt(updateProduct[0].quantity) + 1
                    products = auxCart.products.map(
                        (oneProd) => {
                            if (oneProd._id === pid){
                                oneProd = {_id: pid,quantity: parseInt(newQuantity)}
                            }  
                            return oneProd
                        }
                        )
                }else{
                    products = auxCart.products;
                    products.push({_id: pid, quantity: 1})
                }
                await cartModel.updateOne({_id:cid}, {products: products})
            }
        } catch (error) {
            console.error("No se pudo agregar el producto a el carrito desde mongoDB", error)
        }
    };

    deleteCart = async(id)=>{
        try {
            await cartModel.findByIdAndDelete({ _id: id })
            return { status: "success" };
        } catch (error) {
            console.error("No se pudo eliminar el carrito desde mongoDB")
        }
    }

}

export default CartManager;