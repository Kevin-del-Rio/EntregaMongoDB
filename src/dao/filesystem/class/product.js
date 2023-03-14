
class Product {
    constructor(title, description, price, thumbnail, status, stock, category) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail || [];
        this.status = status;
        this.stock = stock;
        this.category = category
        this.code = Math.random().toString(30).substring(2);
    }

}
export default Product;


