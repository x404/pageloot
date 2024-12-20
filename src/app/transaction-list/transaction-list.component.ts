import { AfterViewInit, Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { TransactionListDataSource } from './transaction-list-datasource';
import { MatIcon } from "@angular/material/icon";
import { MatTooltip } from "@angular/material/tooltip";
import { DatePipe } from "@angular/common";
import { Category, TransactionListItem } from "@interface/interfaces";
import { TransactionDataService } from "../core/services/transaction-data.service";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatRadioButton, MatRadioGroup } from "@angular/material/radio";
import { MatButton } from "@angular/material/button";
import { MatOption, MatSelect } from "@angular/material/select";
import { FormsModule } from "@angular/forms";

@Component({
    selector: 'app-transaction-list',
    templateUrl: './transaction-list.component.html',
    styleUrl: './transaction-list.component.css',
    standalone: true,
    imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatIcon, MatTooltip, DatePipe, MatLabel, MatFormField, MatRadioGroup, MatRadioButton, MatButton, MatSelect, MatOption, FormsModule]
})
export class TransactionListComponent implements AfterViewInit, OnInit {
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild(MatTable) table!: MatTable<TransactionListItem>;
    dataSource = new TransactionListDataSource();

    public transactionDataService = inject(TransactionDataService);

    categories: Category[] = [
        {
            "id": 1,
            "name": "Groceries"
        },
        {
            "id": 2,
            "name": "Salary"
        },
        {
            "id": 3,
            "name": "Entertainment"
        }
    ]




    /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
    displayedColumns = ['type', 'name', 'amount', 'category', 'date'];

    balance = signal<number>(0);

    ngOnInit() {
        this.balance.set(this.dataSource.getBalance());

        this.transactionDataService.transactionData$.subscribe(transactionData => {
            this.balance.set(this.dataSource.getBalance());
        })
    }

    ngAfterViewInit(): void {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.table.dataSource = this.dataSource;
    }

    applyFilter($event: KeyboardEvent) {

    }

    onResetFilter(): void {
        this.transactionDataService.filter.type = null; // Reset the type filter
        this.transactionDataService.filter.category = null; // Reset the category filter
    }

    onTypeChange(value: string): void {
        this.transactionDataService.onTypeChange(value);
    }
    
}
