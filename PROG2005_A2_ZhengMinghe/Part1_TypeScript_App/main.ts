/**
 * Iteration 3: Validation, Update, and Delete Logic
 */

// --- 1. 数据接口定义 ---
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

let inventory: InventoryItem[] = [];

// --- 2. 获取 DOM 元素 ---
const statusDiv = document.getElementById('status-message') as HTMLDivElement;
const displayDiv = document.getElementById('inventory-display') as HTMLDivElement;

// --- 3. 渲染表格函数 ---
function renderTable(data: InventoryItem[]): void {
    if (data.length === 0) {
        displayDiv.innerHTML = '<p>No items found.</p>';
        return;
    }

    let html = `<table><thead><tr><th>ID</th><th>Name</th><th>Qty</th><th>Price</th><th>Actions</th></tr></thead><tbody>`;
    data.forEach(item => {
        html += `
            <tr>
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>
                    <button onclick="deleteItem('${item.name}')" style="background: #e74c3c">Delete</button>
                </td>
            </tr>`;
    });
    html += '</tbody></table>';
    displayDiv.innerHTML = html;
}

// --- 4. 添加商品函数 ---
function addItem(): void {
    // 获取输入值
    const id = (document.getElementById('itemId') as HTMLInputElement).value.trim();
    const name = (document.getElementById('itemName') as HTMLInputElement).value.trim();
    const category = (document.getElementById('itemCategory') as HTMLSelectElement).value as any;
    const qty = parseInt((document.getElementById('itemQuantity') as HTMLInputElement).value);
    const price = parseFloat((document.getElementById('itemPrice') as HTMLInputElement).value);
    const supplier = (document.getElementById('supplierName') as HTMLInputElement).value.trim();
    const status = (document.getElementById('stockStatus') as HTMLSelectElement).value as any;
    const isPop = (document.querySelector('input[name="isPopular"]:checked') as HTMLInputElement).value as any;
    const comment = (document.getElementById('itemComment') as HTMLTextAreaElement).value.trim();

    // 【修正：验证逻辑必须放在函数内】
    // 验证 1: ID 唯一性 (ULO1)
    if (inventory.some(item => item.id === id)) {
        statusDiv.innerText = "Error: Duplicate Item ID! Must be unique.";
        statusDiv.style.color = "red";
        return; // 发现重复，立即停止执行
    }

    // 验证 2: 必填项检查
    if (!id || !name || isNaN(qty) || isNaN(price)) {
        statusDiv.innerText = "Error: Please fill in all required fields.";
        statusDiv.style.color = "red";
        return;
    }

    // 创建新对象
    const newItem: InventoryItem = {
        id, name, category, quantity: qty, price, supplierName: supplier, stockStatus: status, isPopular: isPop, comment
    };

    // 存入数组并刷新页面
    inventory.push(newItem);
    renderTable(inventory);
    statusDiv.innerText = `Success: Added ${name}`;
    statusDiv.style.color = "green";

    // 重置表单
    (document.getElementById('inventory-form') as HTMLFormElement).reset();
}

// --- 5. 按名称更新函数 ---
function updateItem(): void {
    const name = (document.getElementById('itemName') as HTMLInputElement).value.trim();
    
    // 查找商品索引
    const index = inventory.findIndex(item => item.name.toLowerCase() === name.toLowerCase());

    if (index === -1) {
        statusDiv.innerText = "Error: Item name not found for update!";
        statusDiv.style.color = "red";
        return;
    }

    // 更新除了 ID 以外的数据 
    inventory[index].quantity = parseInt((document.getElementById('itemQuantity') as HTMLInputElement).value);
    inventory[index].price = parseFloat((document.getElementById('itemPrice') as HTMLInputElement).value);
    inventory[index].stockStatus = (document.getElementById('stockStatus') as HTMLSelectElement).value as any;
    inventory[index].isPopular = (document.querySelector('input[name="isPopular"]:checked') as HTMLInputElement).value as any;

    statusDiv.innerText = `Success: Updated details for ${name}`;
    statusDiv.style.color = "blue";
    renderTable(inventory);
}

// --- 6. 带确认提示的删除 (ULO2) ---
(window as any).deleteItem = (name: string) => {
    // 使用确认框代替简单删除 
    const confirmed = confirm(`Are you sure you want to delete "${name}"?`);
    if (confirmed) {
        inventory = inventory.filter(item => item.name !== name);
        statusDiv.innerText = `Deleted: ${name}`;
        statusDiv.style.color = "orange";
        renderTable(inventory);
    }
};

// --- 7. 事件绑定 ---
document.getElementById('btnAdd')?.addEventListener('click', addItem);
document.getElementById('btnUpdate')?.addEventListener('click', updateItem);