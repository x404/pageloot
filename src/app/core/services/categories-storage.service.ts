import { inject, Injectable } from '@angular/core';
import { Category } from "@interface/interfaces";
import { LocalStorageService } from "./local-storage.service";

@Injectable({
    providedIn: 'root'
})
export class CategoriesStorageService {
    LOCAL_STORAGE_KEY = 'categories';
    localStorage = inject(LocalStorageService);
    private categories: Category[] = [];

    private readonly INITIAL_CATEGORIES: Category[] = [
        { id: 1, name: 'Groceries' },
        { id: 2, name: 'Salary' },
        { id: 3, name: 'Entertainment' },
    ];
    

    constructor() {
        this.loadCategories();
    }

    private loadCategories(): void {
        const storedCategories = this.localStorage.get<Category[]>(this.LOCAL_STORAGE_KEY);

        if (storedCategories && Array.isArray(storedCategories)) {
            this.categories = storedCategories.filter(
                (item): item is Category => item.id !== undefined && typeof item.name === 'string'
            );
        } else {
            this.localStorage.set(this.LOCAL_STORAGE_KEY, this.INITIAL_CATEGORIES);
            this.categories = [...this.INITIAL_CATEGORIES];
        }
    }

    getCategories = (): Category[] => {
        return this.categories;
    }

    addCategory = (category: Category) => {
        this.categories.push(category);
        this.localStorage.set(this.LOCAL_STORAGE_KEY, this.categories);
    }

}
