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
    regexPattern = /^[0-9]+(\.[0-9]{1,2})?$/;
    
    categories: Category[] = [];
    public transactionDataService = inject(TransactionDataService);
    
    isSaving = signal<boolean>(false);
 
    constructor(
        public dialogRef: MatDialogRef<DialogRecordComponent>,
        private fb: FormBuilder
    ) {
        this.recordForm = this.fb.group({
            name: ['', Validators.required],
            amount: ['', [Validators.required, Validators.pattern(this.regexPattern)]],
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

    get amountControl() {
        return this.recordForm.get('amount')!;
    }


    restrictInput(event: KeyboardEvent): void {
        const allowedKeys = [
            'Backspace',
            'Tab',
            'ArrowLeft',
            'ArrowRight',
            'Delete',
            'Home',
            'End',
        ];
        const char = event.key;

        if (
            // Enable control keys
            allowedKeys.includes(char) ||
            // Let’s solve the numbers
            /^[0-9]$/.test(char) ||
            // Allow one point if it is not already there
            (char === '.' &&
                event.target instanceof HTMLInputElement &&
                !event.target.value.includes('.'))
        ) {
            return;
        }

        event.preventDefault();
    }
    
    validateInput(event: Event) {
        const input = event.target as HTMLInputElement;
        const value = input.value;

        // Remove more than two characters after the '.' if they exist
        if (value.includes('.')) {
            const [intPart, decimalPart] = value.split('.');
            if (decimalPart && decimalPart.length > 2) {
                input.value = `${intPart}.${decimalPart.substring(0, 2)}`;
            }
        }

        // Remove leading zeros if entry starts with them (e.g. 0005 -> 5)
        if (/^0[0-9]/.test(value)) {
            input.value = parseFloat(value).toString();
        }
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
