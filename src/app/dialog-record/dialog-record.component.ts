import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import {
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle
} from "@angular/material/dialog";
import { MatInput, MatInputModule } from "@angular/material/input";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatFormField, MatLabel, MatHint, MatFormFieldModule } from '@angular/material/form-field';
import { MatOption } from "@angular/material/select";
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
import { CategoriesStorageService } from "../core/services/categories-storage.service";
import { AsyncPipe } from "@angular/common";
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from "@angular/material/autocomplete";
import { debounceTime, Observable, of, startWith } from "rxjs";
import { map } from "rxjs/operators";


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
        MatDialogActions,
        MatButton,
        MatDialogClose,
        MatDatepickerToggle,
        MatDatepicker,
        MatDatepickerInput,
        MatHint,
        MatIconModule,
        MatFormFieldModule, MatInputModule, MatDatepickerModule, MatButtonModule, FormsModule,
        ReactiveFormsModule, MatRadioGroup, MatRadioButton, MatAutocomplete, MatOption, MatAutocompleteTrigger, AsyncPipe,
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
    recordForm!: FormGroup;
    regexPattern = /^[0-9]+(\.[0-9]{1,2})?$/;

    categories: Category[] = [];
    public transactionDataService = inject(TransactionDataService);
    public categoriesStorage = inject(CategoriesStorageService);
    isSaving = signal<boolean>(false);
    
    categoryControl = new FormControl<string | Category>('');
    filteredCategories!: Observable<Category[]>;

    private destroyRef = inject(DestroyRef);
    private newCategory?: Category;
    
    constructor(
        public dialogRef: MatDialogRef<DialogRecordComponent>,
        private fb: FormBuilder
    ) {
        this._initializeForm();
    }

    private _initializeForm(): void {
        this.recordForm = this.fb.group({
            name: ['', Validators.required],
            amount: ['', [Validators.required, Validators.pattern(this.regexPattern)]],
            type: ['income'],
            category: ['', Validators.required],
            date: [new Date(), Validators.required]
        });
    }

    ngOnInit() {
        this.categories = this.categoriesStorage.getCategories();
        const valueChangeSubscription = this.categoryControl.valueChanges.pipe(
            startWith(''),
            debounceTime(300),
            map(value => {
                const name = typeof value === 'string' ? value : value?.name;
                return name ? this.filterCategoriesByName(name as string) : this.categories.slice();
            }),
        ).subscribe((filtered) => this.filteredCategories = of(filtered))


        this.destroyRef.onDestroy(() => {
            valueChangeSubscription.unsubscribe();
        })
    }

    private filterCategoriesByName(name: string): Category[] {
        const filterValue = name.trim().toLowerCase();
        return this.categories.filter(option =>
            option.name.toLowerCase().includes(filterValue)
        );
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


    onCategorySelected(event: MatAutocompleteSelectedEvent): void {
        const selectedCategory: Category = event.option.value.name;
        const isNewCategory = typeof event.option.value === 'string';
        if (isNewCategory) {
            this.prepareNewCategoryForSaving();
        } else {
            this.recordForm.patchValue({ category: selectedCategory });
        }
    }


    prepareNewCategoryForSaving(): void {
        const categoryName = this.categoryControl.value as string;
        if (!categoryName || this.isDuplicateCategory(categoryName)) {
            return; // Ignore invalid or duplicate category
        }

        this.newCategory = {
            id: Date.now(), // Generate unique ID
            name: categoryName
        };
        this.categoryControl.setValue(this.newCategory);
        this.recordForm.patchValue({ category: categoryName });
    }


    private isDuplicateCategory(name: string): boolean {
        return this.categories.some(cat => cat.name.toLowerCase() === name.toLowerCase());
    }


    onSubmit() {
        const formData: TransactionListItem = this.recordForm.value;

        if (!this.isFormValid(formData)) {
            return;
        }
        this.isSaving.set(true);
        this.saveTransaction(formData);
        
        if (this.newCategory){
            this.saveNewCategoryIntoStorage();
        }
        this.dialogRef.close();
    }

    private saveNewCategoryIntoStorage(): void {
        if (this.newCategory) {
            this.categoriesStorage.addCategory(this.newCategory);
            this.newCategory = undefined; //reset category
        }
    }

    private saveTransaction(transaction: TransactionListItem): void {
        this.transactionDataService.saveTransaction(transaction);
        this.transactionDataService.refreshTable();
    }

    private isFormValid(formData: TransactionListItem): boolean {
        const { name, amount, type, category } = formData;
        return !!(name && amount && type && category);
    }

    displayCategoryName(category: Category): string {
        // return category.name;
        return category && category.name ? category.name : '';
    }

    addCategoryIfNeeded(): boolean {
        const categoryValue = this.categoryControl.value;
        return typeof categoryValue === 'string'
            && categoryValue.length > 0
            && !this.isDuplicateCategory(categoryValue);
    } 


    protected readonly name = name;
}
