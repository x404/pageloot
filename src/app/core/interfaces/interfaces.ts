export interface Category {
    id: number;
    name: string;
}


export interface TransactionListItem {
    name: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    date: Date;
}
