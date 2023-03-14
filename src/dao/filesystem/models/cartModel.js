import fs from 'file-system'
import Cart from '../class/Cart.js'

class CartManager {
    #cartDirPath;
    #cartsFilePath;
    #fs;
    constructor() {
        this.#cartDirPath = "./DataBase";
        this.#cartsFilePath = this.#cartDirPath + "/carts.json";
        this.#fs = fs;
        this.carts = [];
    }

    #prepararDirectorioBaseCart = async () => {
        await this.#fs.promises.mkdir(this.#cartDirPath, { recursive: true });
        if (!this.#fs.existsSync(this.#cartsFilePath)) {
            await this.#fs.promises.writeFile(this.#cartsFilePath, "[]");
        }
    }

    #traerCarts = async () => {
        let cartsFile = await this.#fs.promises.readFile(this.#cartsFilePath, "utf-8");
        cartsFile = JSON.parse(cartsFile);
        return Object.values(cartsFile);
    }

    getCartById = async (id) => {
        try {
            let ids = parseInt(id)
            await this.#prepararDirectorioBaseCart();
            let cart = await this.#traerCarts();

            cart = cart.filter(element => element.id == ids)
            if (cart.length > 0) {
                return cart;
            }
            else {
                console.log("Cart no encontrado");
            }
        }
        catch (error) {
            console.log(error, `Error consiguiendo cart con id: ${id}`)
        }
    }

    addCart = async () => {
        try {
            await this.#prepararDirectorioBaseCart()
            this.carts = await this.#traerCarts();
            console.log("Creando nuevo carrito:");
            let newId = 1;
                   
            if (this.carts.length > 0) {
                newId = await this.carts[this.carts.length - 1].id + 1
            }
            let instCart = new Cart();
            var newCart = {
                id: newId,
                ...instCart                
            }           
            this.carts.push(newCart);     
            await this.#fs.promises.writeFile(this.#cartsFilePath, JSON.stringify(this.carts))
        } catch (error) {
            console.log(error, `Error creando carrito nuevo: ${newCart.id}`)
        }
    }


    addProductCart = async (ci, pi) => {
        try {
           let cid = parseInt(ci);
           let pid = parseInt(pi)

            const carts = await this.#traerCarts();
            const newCarts = carts.map((c) => {
                if (c.id === Number(cid)) {
                    const index = c.products.findIndex((p) => p.product === Number(pid));
                    if (index === -1) {
                        c.products.push({ product: Number(pid), quantity: 1 });
                        return c;
                    }
                    c.products[index].quantity++;
                }
                return c;
            });
            await this.#fs.promises.writeFile(this.#cartsFilePath, JSON.stringify(newCarts))
        } catch (error) {
            console.log(error);
        }
    };

    deleteCart = async (idd) => {
        try {
            let id = parseInt(idd)
            await this.#prepararDirectorioBaseCart();
            let carts = await this.#traerCarts();

            id = parseInt(id)
            let encontrado = carts.find(element => element.id === id);
            if (encontrado) {
                carts = carts.filter(element => element.id !== id);
                await this.#fs.promises.writeFile(this.#cartsFilePath, JSON.stringify(carts))
            } else {
                console.log(`No se encontro el carrito con id ${id}`)
            }
        }
        catch (error) {
            console.log(error, 'Error al Eliminar el Carrito')
        }
    }

    getCart = async () => {
        try {
            let carts = [];
            await this.#prepararDirectorioBaseCart()
            carts = await this.#traerCarts();
            return carts;
        } catch (error) {
            console.log(error, 'Error al consultar archivos de Persistencia')
        }
    }
}

export default CartManager;


// let cart = new CartManager();
// console.log(cart);

// let carts = async () => {
//     let carti = await cart.getCart();
//     carti.map((x) => console.log(x))
//     // console.log(carti)
// }
// let persistirCarts = async () => {
//     await cart.addcart();
//     await cart.addcart();
//     await cart.addcart();
//     await cart.addcart();
//     await cart.addcart();
//     await cart.addcart();
//     await cart.addcart();
//     await cart.addcart();
// };

// persistirCarts();
// // cart.addProductCart(9, 2);
// // cart.deleteCart(9)
// // cart.getCartById(5)
// // carts();
