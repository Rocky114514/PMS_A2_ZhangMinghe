//24833060-202300408073-张洺赫MingheZhang
import { Injectable } from '@angular/core';
import { InventoryItem } from '../models/item.model';

/**
 * InventoryService: Manages the core data flow of the application.
 * Utilizes the Singleton pattern to ensure inventory data persists within 
 * the browser session across different page navigations.
 */
@Injectable({ providedIn: 'root' })
export class InventoryService {
  // Encapsulated data storage (ULO1), protecting the internal state from direct external modification.
  private inventory: InventoryItem[] = [];

  constructor() {
    // Pre-populating with hardcoded data as per project initialization requirements.
    this.inventory.push({
      id: 'TS-001', name: 'Sample Tablet', category: 'Electronics',
      quantity: 5, price: 499, supplierName: 'TechSupply',
      stockStatus: 'In Stock', isPopular: 'Yes'
    });
  }

  // Returns all inventory records to be consumed by display components.
  getItems(): InventoryItem[] { return this.inventory; }

  // Implements unique ID validation (Data Integrity) before adding new items to the structure.
  addItem(item: InventoryItem): boolean {
    if (this.inventory.some(i => i.id === item.id)) return false;
    this.inventory.push(item);
    return true;
  }

  // Updates item details using 'Item Name' as the primary identifier, fulfilling specific project requirements.
  updateItemByName(name: string, updatedData: Partial<InventoryItem>): boolean {
    const index = this.inventory.findIndex(i => i.name.toLowerCase() === name.toLowerCase());
    if (index !== -1) {
      this.inventory[index] = { ...this.inventory[index], ...updatedData };
      return true;
    }
    return false;
  }

  // Removes items from the collection by filtering the array based on the provided name.
  deleteItemByName(name: string): void {
    this.inventory = this.inventory.filter(i => i.name.toLowerCase() !== name.toLowerCase());
  }

  // Filter logic to retrieve trending/popular items for the Search and Home views.
  getPopularItems(): InventoryItem[] {
    return this.inventory.filter(i => i.isPopular === 'Yes');
  }
}
