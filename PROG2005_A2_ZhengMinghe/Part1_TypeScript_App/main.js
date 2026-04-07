let inventory = [];
const getStatusDiv = () => document.getElementById('status-message');
const getDisplayDiv = () => document.getElementById('inventory-display');
function renderTable(data) {
    const displayDiv = getDisplayDiv();
    if (data.length === 0) {
        displayDiv.innerHTML = '<p class="empty-msg">No items found in the database.</p>';
        return;
    }
    let html = `<table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>`;
    data.forEach(item => {
        html += `
            <tr>
                <td>${item.id}</td>
                <td style="font-weight:bold">${item.name}</td>
                <td>${item.quantity}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>${item.stockStatus}</td>
                <td>
                    <button onclick="deleteItem('${item.name}')" style="background: #e74c3c; color: white; padding: 5px 10px; border-radius: 4px;">Delete</button>
                </td>
            </tr>`;
    });
    html += '</tbody></table>';
    displayDiv.innerHTML = html;
}
function addItem() {
    var _a;
    console.log("Attempting to add item...");
    const statusDiv = getStatusDiv();
    const id = document.getElementById('itemId').value.trim();
    const name = document.getElementById('itemName').value.trim();
    const category = document.getElementById('itemCategory').value;
    const qtyInput = document.getElementById('itemQuantity').value;
    const priceInput = document.getElementById('itemPrice').value;
    const supplier = document.getElementById('supplierName').value.trim();
    const status = document.getElementById('stockStatus').value;
    const isPop = (_a = document.querySelector('input[name="isPopular"]:checked')) === null || _a === void 0 ? void 0 : _a.value;
    const comment = document.getElementById('itemComment').value.trim();
    if (!id || !name || !category || !qtyInput || !priceInput || !supplier) {
        statusDiv.innerText = "Error: Please fill in all required fields (including Category).";
        statusDiv.style.color = "red";
        return;
    }
    const qty = parseInt(qtyInput);
    const price = parseFloat(priceInput);
    if (inventory.some(item => item.id === id)) {
        statusDiv.innerText = "Error: Duplicate Item ID! Must be unique.";
        statusDiv.style.color = "red";
        return;
    }
    const newItem = {
        id, name, category: category, quantity: qty, price, supplierName: supplier, stockStatus: status, isPopular: isPop, comment
    };
    inventory.push(newItem);
    console.log("Current Inventory:", inventory);
    renderTable(inventory);
    statusDiv.innerText = `Success: Added "${name}" to inventory.`;
    statusDiv.style.color = "green";
    document.getElementById('inventory-form').reset();
}
function searchItems() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const results = inventory.filter(i => i.name.toLowerCase().includes(query));
    renderTable(results);
    getStatusDiv().innerText = `Search results for: "${query}"`;
}
function updateItem() {
    const name = document.getElementById('itemName').value.trim();
    const index = inventory.findIndex(item => item.name.toLowerCase() === name.toLowerCase());
    if (index === -1) {
        getStatusDiv().innerText = "Error: Item name not found for update!";
        getStatusDiv().style.color = "red";
        return;
    }
    inventory[index].quantity = parseInt(document.getElementById('itemQuantity').value) || 0;
    inventory[index].price = parseFloat(document.getElementById('itemPrice').value) || 0;
    inventory[index].stockStatus = document.getElementById('stockStatus').value;
    inventory[index].isPopular = document.querySelector('input[name="isPopular"]:checked').value;
    getStatusDiv().innerText = `Success: Updated ${name}`;
    getStatusDiv().style.color = "blue";
    renderTable(inventory);
}
window.deleteItem = (name) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
        inventory = inventory.filter(item => item.name !== name);
        renderTable(inventory);
        getStatusDiv().innerText = `Deleted: ${name}`;
    }
};
window.addEventListener('DOMContentLoaded', () => {
    var _a, _b, _c, _d, _e;
    (_a = document.getElementById('btnAdd')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', addItem);
    (_b = document.getElementById('btnUpdate')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', updateItem);
    (_c = document.getElementById('btnSearch')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', searchItems);
    (_d = document.getElementById('btnShowAll')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', () => {
        renderTable(inventory);
        getStatusDiv().innerText = "Showing all items.";
    });
    (_e = document.getElementById('btnShowPopular')) === null || _e === void 0 ? void 0 : _e.addEventListener('click', () => {
        const populars = inventory.filter(i => i.isPopular === 'Yes');
        renderTable(populars);
        getStatusDiv().innerText = "Showing popular items.";
    });
});
