import { inject, Injectable, OnChanges, signal, SimpleChanges } from '@angular/core';
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

    filter = signal<{
        type: string | null;
        category: string | null;
    }>({
        type: null,
        category: null
    });


    LOCAL_STORAGE_KEY = 'transaction-data';
    INITIAL_TRANSACTION_DATA: TransactionListItem[] = [];
    TRANSACTION_DATA: TransactionListItem[] = [];


    private allTransactions: TransactionListItem[] = [...this.TRANSACTION_DATA]; // Оригинальные данные
    private filteredTransactionData: TransactionListItem[] = [...this.TRANSACTION_DATA]; // Текущие отфильтрованные данные


    constructor() {
        if (this.localStorage.has(this.LOCAL_STORAGE_KEY)) {
            this.TRANSACTION_DATA = this.localStorage.get(this.LOCAL_STORAGE_KEY);
        } else {
            this.localStorage.set(this.LOCAL_STORAGE_KEY, this.INITIAL_TRANSACTION_DATA);
            this.TRANSACTION_DATA = this.INITIAL_TRANSACTION_DATA;
        }

        this.transactionDataSubject$.next(this.TRANSACTION_DATA);
    }

    getAllTransactionData(): TransactionListItem[] {
        return this.TRANSACTION_DATA;
    }

    getFilteredTransactionData(): TransactionListItem[] {
        const { type, category } = this.filter();
        if (type || category) {
            return this.filteredTransactionData;
        }
        return this.getAllTransactionData();
    }

    saveTransaction(data: TransactionListItem) {
        this.TRANSACTION_DATA.push(data);
        this.localStorage.set(this.LOCAL_STORAGE_KEY, this.TRANSACTION_DATA);
        this.refreshTable(this.TRANSACTION_DATA);
    }

    private refreshTable(data: TransactionListItem[]) {
        this.transactionDataSubject$.next(data);
    }

    typeChange(value: string | null): void {
        // this.filtered_transaction_data = this.TRANSACTION_DATA.filter(transaction => {
        //     return transaction.type.toLowerCase() === value.toLowerCase();
        // })
        //
        // this.refreshTable(this.filtered_transaction_data);

        this.filter.update(current => ({
            ...current,
            type: value
        }));
        this.applyFilters();
    }

    modelChange(value: string | null): void {
        // this.filtered_transaction_data = this.TRANSACTION_DATA.filter(transaction => {
        //     return transaction.category.toLowerCase() === value.toLowerCase();
        // })
        //
        // this.refreshTable(this.filtered_transaction_data);

        this.filter.update(current => ({
            ...current,
            category: value
        }));
        this.applyFilters();

    }

    private applyFilters(): void {
        const { type, category } = this.filter();
        this.filteredTransactionData = this.TRANSACTION_DATA.filter(transaction => {
            const matchesType = type ? transaction.type.toLowerCase() === type.toLowerCase() : true;
            const matchesCategory = category ? transaction.category.toLowerCase() === category.toLowerCase() : true;
            return matchesType && matchesCategory;
        });

        this.refreshTable(this.filteredTransactionData);
    }


    resetFilter(): void {
        this.filter.update(() => ({
            type: null,
            category: null,
        }));
        this.filteredTransactionData = this.TRANSACTION_DATA;
        this.refreshTable(this.TRANSACTION_DATA);
    }
}
