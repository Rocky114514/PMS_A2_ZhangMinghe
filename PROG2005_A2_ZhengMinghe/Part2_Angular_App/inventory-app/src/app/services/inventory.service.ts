import { Injectable } from '@angular/core';
import { InventoryItem } from '../models/item.model';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private inventory: InventoryItem[] = [];

  constructor() {
    // 初始测试数据
    this.inventory.push({
      id: 'TS-001', name: 'Sample Tablet', category: 'Electronics',
      quantity: 5, price: 499, supplierName: 'TechSupply',
      stockStatus: 'In Stock', isPopular: 'Yes'
    });
  }

  getItems(): InventoryItem[] { return this.inventory; }

  addItem(item: InventoryItem): boolean {
    if (this.inventory.some(i => i.id === item.id)) return false;
    this.inventory.push(item);
    return true;
  }

  updateItemByName(name: string, updatedData: Partial<InventoryItem>): boolean {
    const index = this.inventory.findIndex(i => i.name.toLowerCase() === name.toLowerCase());
    if (index !== -1) {
      this.inventory[index] = { ...this.inventory[index], ...updatedData };
      return true;
    }
    return false;
  }

  deleteItemByName(name: string): void {
    this.inventory = this.inventory.filter(i => i.name.toLowerCase() !== name.toLowerCase());
  }

  getPopularItems(): InventoryItem[] {
    return this.inventory.filter(i => i.isPopular === 'Yes');
  }
}