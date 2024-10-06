export interface Product {
    name: string;
    description: string;
    price: number | null;
    quantity: number | null;
}

export interface Login {
    email: string;
    password: string;
}