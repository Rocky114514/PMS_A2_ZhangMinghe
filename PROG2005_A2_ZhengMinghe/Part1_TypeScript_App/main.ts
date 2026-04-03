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
// 渲染表格函数
function renderTable(data: InventoryItem[]): void {
    let html = `<table><thead><tr><th>ID</th><th>Name</th><th>Qty</th><th>Price</th><th>Actions</th></tr></thead><tbody>`;
    data.forEach(item => {
        html += `<tr><td>${item.id}</td><td>${item.name}</td><td>${item.quantity}</td><td>$${item.price}</td>
                 <td><button onclick="deleteItem('${item.name}')">Delete</button></td></tr>`;
    });
    html += '</tbody></table>';
    displayDiv.innerHTML = html;
}

// 添加商品函数
function addItem(): void {
    const id = (document.getElementById('itemId') as HTMLInputElement).value;
    const name = (document.getElementById('itemName') as HTMLInputElement).value;
    // ...获取其他字段...
    
    const newItem: InventoryItem = { id, name, /* ...其他字段... */ } as any;
    inventory.push(newItem);
    renderTable(inventory);
    (document.getElementById('status-message') as any).innerText = "Item Added!";
}

document.getElementById('btnAdd')?.addEventListener('click', addItem);