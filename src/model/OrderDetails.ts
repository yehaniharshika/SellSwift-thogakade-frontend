export class OrderDetails {
    OrderDetailsID: string; // Unique ID for each order item
    code: number;
    getQty: number;
    price: number;
    totalPrice: number;

    constructor(OrderDetailsID:string,code:number,getQty:number,price:number,totalPrice:number) {
        this.OrderDetailsID = OrderDetailsID;
        this.code = code;
        this.getQty = getQty;
        this.price = price;
        this.totalPrice = totalPrice;
    }
}