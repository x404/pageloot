export interface RecordDataForCreation {
    name: string;
    amount: string;
    type: 'income' | 'expense';
    category: string;
    date: Date;
}