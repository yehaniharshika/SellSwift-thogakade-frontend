import {OrderDetails} from "./OrderDetails.ts";

export class Order {
    orderId: number;
    orderDate: string;
    id: string;
    items: OrderDetails[];

    constructor(orderId: number, orderDate: string, id: string, items: OrderDetails[]) {
        this.orderId = orderId;
        this.orderDate = orderDate;
        this.id = id;
        this.items = items;
    }
}