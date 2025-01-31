export class Item{
    code: string;
    itemName: string;
    quantity: string;
    price: string;

    constructor(code: string, itemName: string, quantity: string, price: string) {
        this.code = code;
        this.itemName = itemName;
        this.quantity = quantity;
        this.price = price;
    }
}