export interface ILink {
    title:string;
    path:string;
    icon:React.ReactNode;
} 

export interface ICustomer {
    _id:string;
    fname:string;
    lname:string;
    phone_primary:string;
    budget:number;
    address:string;
    pin:boolean;
    isPaidToday: boolean;
}

export interface IProduct {
    _id:string;
    title:string;
    price:number;
    quantity:number;
}