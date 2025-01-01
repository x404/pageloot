import { Injectable } from '@angular/core';
import { Category, TransactionListItem } from "@interface/interfaces";

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  /**
   * Stores a value in the local storage under the specified key.
   * The value is serialized to JSON format before being saved.
   *
   * @param {string} key - The key under which the value will be stored.
   * @param {any} value - The value to store, which will be converted to a JSON string.
   */
  public set(key: any, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  /**
   * Retrieves a value from the local storage by the specified key.
   * The value is parsed from JSON format before being returned.
   * If the key does not exist, it returns null.
   *
   * @param {string} key - The key to look up in local storage.
   * @returns {any | null} - The parsed value associated with the key, or null if the key is not found.
   */
  public get<T>(key: string): T | null {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : null;
  }

  /**
   * Removes a value from local storage by the specified key.
   *
   * @param {string} key - The key of the item to be removed from local storage.
   * @returns {void} - No return value.
   */
  public remove(key: string): any {
    localStorage.removeItem(key);
  }

  /**
   * Checks if a value exists in local storage for the specified key.
   *
   * @param {string} key - The key to check in local storage.
   * @returns {boolean} - Returns `true` if the key exists, otherwise `false`.
   */
  public has(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }

  /**
   * Clears all items from local storage.
   *
   * @returns {void} - No return value.
   */
  public clear(): void {
    localStorage.clear();
  }
}
