import { Component, inject, OnInit, signal } from '@angular/core';
import {
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle
} from "@angular/material/dialog";
import { MatInput, MatInputModule } from "@angular/material/input";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatFormField, MatLabel, MatHint, MatFormFieldModule } from '@angular/material/form-field';
import { MatOption, MatSelect } from "@angular/material/select";
import { MatButton, MatButtonModule } from "@angular/material/button";
import { MatIconModule } from '@angular/material/icon';


import {
    MatDatepicker,
    MatDatepickerInput, MatDatepickerModule,
    MatDatepickerToggle
} from "@angular/material/datepicker";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { MatRadioButton, MatRadioGroup } from "@angular/material/radio";
import { Category, TransactionListItem } from "@interface/interfaces";
import { TransactionDataService } from "../core/services/transaction-data.service";


export const MY_FORMATS = {
    parse: {
        dateInput: 'LL'
    },
    display: {
        dateInput: 'DD.MM.YYYY',
        monthYearLabel: 'YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'YYYY'
    }
};


@Component({
    selector: 'app-dialog-record',
    imports: [
        MatDialogTitle,
        MatDialogContent,
        MatFormField,
        MatInput,
        ReactiveFormsModule,
        MatLabel,
        MatSelect,
        MatOption,
        MatDialogActions,
        MatButton,
        MatDialogClose,
        MatDatepickerToggle,
        MatDatepicker,
        MatDatepickerInput,
        MatHint,
        MatIconModule,
        MatFormFieldModule, MatInputModule, MatDatepickerModule, MatButtonModule, FormsModule,
        ReactiveFormsModule, MatRadioGroup, MatRadioButton,
    ],
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
    standalone: true,
    templateUrl: './dialog-record.component.html',
    styleUrl: './dialog-record.component.css'
})
export class DialogRecordComponent implements OnInit {
    recordForm: FormGroup;
    categories: Category[] = [];
    public transactionDataService = inject(TransactionDataService);


    isSaving = signal<boolean>(false);


    constructor(
        public dialogRef: MatDialogRef<DialogRecordComponent>,
        private fb: FormBuilder
    ) {
        this.recordForm = this.fb.group({
            name: ['', Validators.required],
            amount: ['', Validators.required],
            type: ['income'],
            category: ['', Validators.required],
            date: [new Date(), Validators.required]
        })
    }

    ngOnInit() {
        this.categories = [
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
    }

    onSubmit() {
        const formData: TransactionListItem = this.recordForm.value;

        if (!this.isFormValid(formData)) {
            return;
        }

        this.isSaving.set(true);

        // Prepare product data for saving
        // const product = this.prepareProductData(formData);
        //
        // Save product data and refresh table
        this.saveTransaction(formData);
        // this.transactionDataService.refreshTable();
        
        this.dialogRef.close();
    }
    
    private saveTransaction(transaction: TransactionListItem): void {
        this.transactionDataService.saveTransaction(transaction);
    }
    
    private isFormValid(formData: any): boolean {
        const { name, amount, type, category } = formData;
        return name && amount && type && category;
    }


    protected readonly name = name;
}
