// src/app/models/item.model.ts
export interface InventoryItem {
  id: string;               // 唯一ID
  name: string;             // 商品名称
  category: 'Electronics' | 'Furniture' | 'Clothing' | 'Tools' | 'Miscellaneous';
  quantity: number;         // 数量
  price: number;            // 价格
  supplierName: string;     // 供应商
  stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';
  isPopular: 'Yes' | 'No';
  comment?: string;         // 可选备注
}