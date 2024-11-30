import { Component } from '@angular/core';
import { TransactionListComponent } from "../../transaction-list/transaction-list.component";

@Component({
  selector: 'app-home',
    imports: [
        TransactionListComponent
    ],
  templateUrl: './home.component.html',
  standalone: true,
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
