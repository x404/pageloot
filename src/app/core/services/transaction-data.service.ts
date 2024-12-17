import { inject, Injectable } from '@angular/core';
import { TransactionListItem } from "@interface/interfaces";
import { BehaviorSubject } from "rxjs";
import { LocalStorageService } from "./local-storage.service";


@Injectable({
    providedIn: 'root'
})
export class TransactionDataService {
    private transactionDataSubject = new BehaviorSubject<TransactionListItem[]>([]);
    transactionData$ = this.transactionDataSubject.asObservable();
    
    public localStorage = inject(LocalStorageService);
    
    LOCAL_STORAGE_KEY = 'transaction-data';
    START_TRANSACTION_DATA = [
        { name: 'Hydrogen', amount: 1, type: 'income', category: 'Groceries', date: new Date() },
        { name: 'Helium', amount: 3, type: 'income', category: 'Groceries', date: new Date() },
        { name: 'Lithium', amount: 5, type: 'expense', category: 'Salary', date: new Date() },
        { name: 'Beryllium', amount: 10, type: 'income', category: 'Groceries', date: new Date() }
    ];
    TRANSACTION_DATA : TransactionListItem[] = [];

    constructor() {
        if (this.localStorage.has(this.LOCAL_STORAGE_KEY)) {
            this.TRANSACTION_DATA = this.localStorage.get(this.LOCAL_STORAGE_KEY);
        } else {
            this.localStorage.set(this.LOCAL_STORAGE_KEY, this.START_TRANSACTION_DATA);
        }
        
        this.transactionDataSubject.next(this.TRANSACTION_DATA);
    }
    
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
