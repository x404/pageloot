import { inject, Injectable } from '@angular/core';
import { TransactionListItem } from "../interfaces/interfaces";
import { BehaviorSubject } from "rxjs";


@Injectable({
    providedIn: 'root'
})
export class TransactionDataService {
    private transactionDataSubject = new BehaviorSubject<TransactionListItem[]>([]);
    transactionData$ = this.transactionDataSubject.asObservable();

    constructor() {
        this.transactionDataSubject.next(this.TRANSACTION_DATA);
    }
    
    TRANSACTION_DATA: TransactionListItem[] = [
        { name: 'Hydrogen', amount: 1, type: 'income', category: 'Groceries', date: new Date() },
        { name: 'Helium', amount: 3, type: 'income', category: 'Groceries', date: new Date() },
        { name: 'Lithium', amount: 5, type: 'expense', category: 'Salary', date: new Date() },
        { name: 'Beryllium', amount: 10, type: 'income', category: 'Groceries', date: new Date() }
    ];
    
    getTransactionData(){
        return this.TRANSACTION_DATA;
    }

    saveTransaction(data: TransactionListItem) {
        this.TRANSACTION_DATA.push(data);
        this.transactionDataSubject.next(this.TRANSACTION_DATA);
    }
    
    refreshTable() {
        
    }
}
