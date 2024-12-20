import { Component } from '@angular/core';
import { TransactionListComponent } from "../../transaction-list/transaction-list.component";
import { MatButton } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { DialogRecordComponent } from "../../dialog-record/dialog-record.component";

@Component({
    selector: 'app-home',
    imports: [
        TransactionListComponent,
        MatButton
    ],
    templateUrl: './home.component.html',
    standalone: true,
    styleUrl: './home.component.css'
})
export class HomeComponent {
    constructor( public dialogRef: MatDialog) {
    }
    
    onAddRecord() {
        this.openDialog();
    }

    openDialog(productId?: number): void {
        const dialogRef = this.dialogRef.open(DialogRecordComponent, {
            width: '500px',
            maxHeight: '80vh',
            data: {
                animal: 'panda',
            }
        });
    }
}
