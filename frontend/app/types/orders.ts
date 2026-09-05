export interface Order {
    order_id: string;
    user_id: string;
    username: string;
    total_amount: number;
    status: string;
    order_date: string;
    items: {
        product_id: string;
        name: string;
        price: number;
        quantity: number;
    }[];
}