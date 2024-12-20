import { inject, Injectable, OnChanges, SimpleChanges } from '@angular/core';
import { TransactionListItem } from "@interface/interfaces";
import { BehaviorSubject } from "rxjs";
import { LocalStorageService } from "./local-storage.service";


@Injectable({
    providedIn: 'root'
})
export class TransactionDataService {
    private transactionDataSubject$ = new BehaviorSubject<TransactionListItem[]>([]);
    transactionData$ = this.transactionDataSubject$.asObservable();

    public localStorage = inject(LocalStorageService);

    filter = {
        type: null,
        category: null
    };


    LOCAL_STORAGE_KEY = 'transaction-data';
    // INITIAL_TRANSACTION_DATA: TransactionListItem[] = [
    //     { name: 'Hydrogen', amount: 1, type: 'income', category: 'Groceries', date: new Date() },
    //     { name: 'Helium', amount: 3, type: 'income', category: 'Groceries', date: new Date() },
    //     { name: 'Lithium', amount: 5, type: 'expense', category: 'Salary', date: new Date() },
    //     { name: 'Beryllium', amount: 10, type: 'income', category: 'Groceries', date: new Date() }
    // ];
    INITIAL_TRANSACTION_DATA: TransactionListItem[] = [];
    TRANSACTION_DATA: TransactionListItem[] = [];
    filtered_transaction_data: TransactionListItem[] = [];

    constructor() {
        if (this.localStorage.has(this.LOCAL_STORAGE_KEY)) {
            this.TRANSACTION_DATA = this.localStorage.get(this.LOCAL_STORAGE_KEY);
        } else {
            this.localStorage.set(this.LOCAL_STORAGE_KEY, this.INITIAL_TRANSACTION_DATA);
            this.TRANSACTION_DATA = this.INITIAL_TRANSACTION_DATA;
        }

        this.transactionDataSubject$.next(this.TRANSACTION_DATA);
    }

    getTransactionData(): TransactionListItem[] {
        return this.TRANSACTION_DATA;
    }

    getFilteredTransactionData(): TransactionListItem[] {
        if (this.filtered_transaction_data.length > 0) {
            return this.filtered_transaction_data;
        } else {
            return this.getTransactionData();
        }
    }

    saveTransaction(data: TransactionListItem) {
        this.TRANSACTION_DATA.push(data);
        this.localStorage.set(this.LOCAL_STORAGE_KEY, this.TRANSACTION_DATA);
        this.refreshTable(this.TRANSACTION_DATA);
    }

    private refreshTable(data: TransactionListItem[]) {
        this.transactionDataSubject$.next(data);
    }

    typeChange(value: string): void {
        this.filtered_transaction_data = this.TRANSACTION_DATA.filter(transaction => {
            return transaction.type === value;
        })

        this.refreshTable(this.filtered_transaction_data);
    }

    resetFilter(): void {
        this.filter.type = null;
        this.filter.category = null;
        
        this.filtered_transaction_data = [];
        this.refreshTable(this.TRANSACTION_DATA);
    }
}
