export class Customer {
    id: string;
    name: string;
    nic: string;
    email: string;
    phone: string;

    constructor(id:string,name: string, nic:string,email: string, phone: string) {
        this.id = id;
        this.name = name;
        this.nic = nic;
        this.email = email;
        this.phone = phone;
    }
}