// 1. 定义接口 (Model)
interface InventoryItem {
    id: string;
    name: string;
    category: 'Electronics' | 'Furniture' | 'Clothing' | 'Tools' | 'Miscellaneous';
    quantity: number;
    price: number;
    supplierName: string;
    stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';
    isPopular: 'Yes' | 'No';
    comment?: string;
}

// 2. 初始化存储数组
let inventory: InventoryItem[] = [];

// 3. 获取 DOM 引用
const statusDiv = document.getElementById('status-message') as HTMLDivElement;
const displayDiv = document.getElementById('inventory-display') as HTMLDivElement;

console.log("Iteration 1: Environment ready.");