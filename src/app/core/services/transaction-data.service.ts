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

    private LOCAL_STORAGE_KEY = 'transaction-data';
    private INITIAL_TRANSACTION_DATA: TransactionListItem[] = [];

    filter = signal<{
        type: string | null;
        category: string | null;
    }>({
        type: null,
        category: null
    });

    private transactionData: TransactionListItem[] = [];
    private filteredTransactionData: TransactionListItem[] = [...this.transactionData]; // Текущие отфильтрованные данные

    constructor() {
        this.initializeData();
        this.refreshTable();
    }

    private initializeData(): void {
        if (this.localStorage.has(this.LOCAL_STORAGE_KEY)) {
            this.transactionData = this.localStorage.get(this.LOCAL_STORAGE_KEY) as TransactionListItem[];
        } else {
            this.localStorage.set(this.LOCAL_STORAGE_KEY, this.INITIAL_TRANSACTION_DATA);
            this.transactionData = [...this.INITIAL_TRANSACTION_DATA];
        }
    }

    getAllTransactionData(): TransactionListItem[] {
        return this.transactionData;
    }

    getFilteredTransactionData(): TransactionListItem[] {
        const { type, category } = this.filter();
        if (type || category) {
            return this.filteredTransactionData;
        }
        return this.getAllTransactionData();
    }

    saveTransaction(data: TransactionListItem) {
        console.log('saveTransaction', data);
        if (!data) {
            console.error('Invalid transaction data');
            return;
        }

        this.transactionData.push(data);
        this.localStorage.set(this.LOCAL_STORAGE_KEY, this.transactionData);
    }

    public refreshTable(data?: TransactionListItem[]) {
        console.log('refreshTable', data);
        this.transactionDataSubject$.next(data || this.transactionData);
    }

    changeType(value: string | null): void {
        this.filter.update(current => ({
            ...current,
            type: value
        }));

        this.applyFilters();
    }

    changeModel(value: string | null): void {
        this.filter.update(current => ({
            ...current,
            category: value
        }));

        this.applyFilters();
    }

    private applyFilters(): void {
        const { type, category } = this.filter();
        this.filteredTransactionData = this.transactionData.filter(transaction => {
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

        this.filteredTransactionData = [...this.transactionData];
        this.refreshTable();
    }
}
