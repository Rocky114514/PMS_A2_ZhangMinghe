import { Injectable } from '@angular/core';
import { InventoryItem } from '../item.model';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  // 核心数据存储（在浏览器打开期间有效）
  private inventory: InventoryItem[] = [];

  constructor() {
    // 预置一条测试数据，方便稍后测试搜索和显示页面
    this.inventory.push({
      id: 'TS-001', name: 'Sample Item', category: 'Electronics',
      quantity: 5, price: 99.99, supplierName: 'TechCorp',
      stockStatus: 'In Stock', isPopular: 'Yes', comment: 'Initial sample'
    });
  }

  // 获取所有商品
  getItems(): InventoryItem[] {
    return this.inventory;
  }

  // 添加新商品（含 ID 唯一性检查）
  addItem(item: InventoryItem): boolean {
    if (this.inventory.some(i => i.id === item.id)) {
      return false; // ID 重复
    }
    this.inventory.push(item);
    return true;
  }

  // 按名称更新商品 (作业要求)
  updateItemByName(name: string, updatedData: Partial<InventoryItem>): boolean {
    const index = this.inventory.findIndex(i => i.name.toLowerCase() === name.toLowerCase());
    if (index !== -1) {
      this.inventory[index] = { ...this.inventory[index], ...updatedData };
      return true;
    }
    return false;
  }

  // 按名称删除商品 (带确认逻辑将在组件中实现)
  deleteItemByName(name: string): void {
    this.inventory = this.inventory.filter(i => i.name.toLowerCase() !== name.toLowerCase());
  }
}