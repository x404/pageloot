import { Injectable } from '@angular/core';
import { Category } from "@interface/interfaces";

@Injectable({
    providedIn: 'root'
})
export class CategoriesStorageService {
    private categories: Category[] = [
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

    getCategories = () : Category[] => {
        return this.categories;
    }
    
    addCategory = (category: Category) => {
        this.categories.push(category);
    }

}
