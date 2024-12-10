import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';
import { TransactionListItem } from "@interface/interfaces";
import { TransactionDataService } from "../core/services/transaction-data.service";
import { inject } from "@angular/core";



/**
 * Data source for the TransactionList view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class TransactionListDataSource extends DataSource<TransactionListItem> {

  public transactionDataService = inject(TransactionDataService);
  data: TransactionListItem[] = this.transactionDataService.getTransactionData();
  
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;
  
  
  constructor() {
    super();
  }
  

  getBalance(): number {
    const balance = this.transactionDataService.getTransactionData().reduce( (acc, transactionItem) => {
      if (transactionItem.type === 'expense') {
        acc -= +transactionItem.amount;
      } else {
        acc += +transactionItem.amount;
      }
      return acc;
    }, 0)
    return balance;
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  // connect(): Observable<TransactionListItem[]> {
  //   if (this.paginator && this.sort) {
  //     // Combine everything that affects the rendered data into one update
  //     // stream for the data-table to consume.
  //     return merge(observableOf(this.data), this.paginator.page, this.sort.sortChange)
  //       .pipe(map(() => {
  //         return this.getPagedData(this.getSortedData([...this.data ]));
  //       }));
  //   } else {
  //     throw Error('Please set the paginator and sort on the data source before connecting.');
  //   }
  // }

  connect(): Observable<TransactionListItem[]> {
    if (this.paginator && this.sort) {
      return merge(
          this.transactionDataService.transactionData$,
          this.paginator.page,
          this.sort.sortChange
      ).pipe(
          map(() => {
            const data = this.transactionDataService.getTransactionData();
            return this.getPagedData(this.getSortedData([...data]));
          })
      );
    } else {
      throw Error('Please set the paginator and sort on the data source before connecting.');
    }
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(): void {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: TransactionListItem[]): TransactionListItem[] {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.splice(startIndex, this.paginator.pageSize);
    } else {
      return data;
    }
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: TransactionListItem[]): TransactionListItem[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      switch (this.sort?.active) {
        case 'name': return compare(a.name, b.name, isAsc);
        // case 'id': return compare(+a.id, +b.id, isAsc);
        default: return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
