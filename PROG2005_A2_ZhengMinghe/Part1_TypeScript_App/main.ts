//24833060-202300408073-张洺赫MingheZhang
/**
 * PROG2005 Programming Mobile Systems - Assessment 2
 * Part 1: Standalone TypeScript System
 * Author: [Your Name]
 * Description: A pure TypeScript-based inventory management system 
 * utilizing structured data models and dynamic DOM manipulation.
 */

// --- 1. Data Model Definition (ULO1: Type Enforcement) ---
// Defines a strict structure for inventory items to maintain data integrity.
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

// --- 2. Global State Management ---
// Maintains a structured array of objects in memory for session-based persistence.
let inventory: InventoryItem[] = [];

// Helper functions for safe DOM element retrieval and type casting.
const getStatusDiv = () => document.getElementById('status-message') as HTMLDivElement;
const getDisplayDiv = () => document.getElementById('inventory-display') as HTMLDivElement;

// --- 3. Core Function: Dynamic Table Rendering ---
// Utilizes innerHTML assignments instead of alert() calls to fulfill project requirements.
function renderTable(data: InventoryItem[]): void {
    const displayDiv = getDisplayDiv();
    if (data.length === 0) {
        displayDiv.innerHTML = '<p class="empty-msg">No records found matching criteria.</p>';
        return;
    }

    // Generates a responsive HTML table structure dynamically based on the current data state.
    let html = `
        <table>
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
            <tbody>
    `;

    data.forEach(item => {
        html += `
            <tr>
                <td>${item.id}</td>
                <td style="font-weight:bold">${item.name}</td>
                <td>${item.quantity}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>${item.stockStatus}</td>
                <td>
                    <!-- Interaction: Calls global scope functions for item modification -->
                    <button onclick="editItem('${item.name}')" style="background: #3498db; color: white; padding: 5px 10px; margin-right:5px; font-size:12px;">Edit</button>
                    <button onclick="deleteItem('${item.name}')" style="background: #e74c3c; color: white; padding: 5px 10px; font-size:12px;">Delete</button>
                </td>
            </tr>`;
    });

    html += '</tbody></table>';
    displayDiv.innerHTML = html;
}

// --- 4. Core Function: Add New Item ---
// Implements data validation and unique ID constraints as specified in the brief.
function addItem(): void {
    const statusDiv = getStatusDiv();

    // Captures raw input from HTML elements for processing.
    const idInput = document.getElementById('itemId') as HTMLInputElement;
    const nameInput = document.getElementById('itemName') as HTMLInputElement;
    const categoryInput = document.getElementById('itemCategory') as HTMLSelectElement;
    const qtyInput = document.getElementById('itemQuantity') as HTMLInputElement;
    const priceInput = document.getElementById('itemPrice') as HTMLInputElement;
    const supplierInput = document.getElementById('supplierName') as HTMLInputElement;
    const statusInput = document.getElementById('stockStatus') as HTMLSelectElement;
    const isPopInput = document.querySelector('input[name="isPopular"]:checked') as HTMLInputElement;
    const commentInput = document.getElementById('itemComment') as HTMLTextAreaElement;

    // Validation logic: Ensures all mandatory fields are populated before saving.
    if (!idInput.value || !nameInput.value || !categoryInput.value || !qtyInput.value || !priceInput.value || !supplierInput.value) {
        statusDiv.innerText = "Error: All starred (*) fields are required.";
        statusDiv.style.color = "red";
        return;
    }

    // Uniqueness constraint: Checks if Item ID already exists in the local data structure.
    if (inventory.some(item => item.id === idInput.value.trim())) {
        statusDiv.innerText = "Error: Item ID already exists! It must be unique.";
        statusDiv.style.color = "red";
        return;
    }

    const newItem: InventoryItem = {
        id: idInput.value.trim(),
        name: nameInput.value.trim(),
        category: categoryInput.value as any,
        quantity: parseInt(qtyInput.value),
        price: parseFloat(priceInput.value),
        supplierName: supplierInput.value.trim(),
        stockStatus: statusInput.value as any,
        isPopular: isPopInput.value as any,
        comment: commentInput.value.trim()
    };

    inventory.push(newItem);
    renderTable(inventory);
    
    statusDiv.innerText = `Success: Added "${newItem.name}" to inventory.`;
    statusDiv.style.color = "green";
    (document.getElementById('inventory-form') as HTMLFormElement).reset();
}

// --- 5. Core Function: Update by Name ---
// Directly addresses the requirement to update item details using the Item Name as a key.
function updateItem(): void {
    const name = (document.getElementById('itemName') as HTMLInputElement).value.trim();
    const index = inventory.findIndex(i => i.name.toLowerCase() === name.toLowerCase());

    if (index === -1) {
        getStatusDiv().innerText = "Error: Cannot update. Item name not found in database.";
        getStatusDiv().style.color = "red";
        return;
    }

    // Updates existing object properties while maintaining the unique identifier (ID).
    inventory[index].quantity = parseInt((document.getElementById('itemQuantity') as HTMLInputElement).value) || 0;
    inventory[index].price = parseFloat((document.getElementById('itemPrice') as HTMLInputElement).value) || 0;
    inventory[index].category = (document.getElementById('itemCategory') as HTMLSelectElement).value as any;
    inventory[index].supplierName = (document.getElementById('supplierName') as HTMLInputElement).value.trim();
    inventory[index].stockStatus = (document.getElementById('stockStatus') as HTMLSelectElement).value as any;
    inventory[index].isPopular = (document.querySelector('input[name="isPopular"]:checked') as HTMLInputElement).value as any;
    inventory[index].comment = (document.getElementById('itemComment') as HTMLTextAreaElement).value.trim();

    getStatusDiv().innerText = `Success: Updated details for "${name}".`;
    getStatusDiv().style.color = "blue";
    renderTable(inventory);
}

// --- 6. Edit Logic: Form Pre-filling (ULO2) ---
// Enhances UX by populating the form with existing data when the 'Edit' button is clicked.
(window as any).editItem = (name: string) => {
    const item = inventory.find(i => i.name.toLowerCase() === name.toLowerCase());
    if (item) {
        (document.getElementById('itemId') as HTMLInputElement).value = item.id;
        (document.getElementById('itemName') as HTMLInputElement).value = item.name;
        (document.getElementById('itemCategory') as HTMLSelectElement).value = item.category;
        (document.getElementById('itemQuantity') as HTMLInputElement).value = item.quantity.toString();
        (document.getElementById('itemPrice') as HTMLInputElement).value = item.price.toString();
        (document.getElementById('supplierName') as HTMLInputElement).value = item.supplierName;
        (document.getElementById('stockStatus') as HTMLSelectElement).value = item.stockStatus;
        
        const popYes = document.getElementById('popYes') as HTMLInputElement;
        const popNo = document.getElementById('popNo') as HTMLInputElement;
        if (item.isPopular === 'Yes') popYes.checked = true;
        else popNo.checked = true;

        (document.getElementById('itemComment') as HTMLTextAreaElement).value = item.comment || '';

        const statusDiv = getStatusDiv();
        statusDiv.innerText = `Mode: Editing "${name}". Click Update button to save.`;
        statusDiv.style.color = "#3498db";
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

// --- 7. Delete Logic: Confirmation Prompt (ULO2) ---
// Implements user confirmation prompts to prevent accidental data loss.
(window as any).deleteItem = (name: string) => {
    if (confirm(`Are you sure you want to delete "${name}" from inventory?`)) {
        inventory = inventory.filter(i => i.name.toLowerCase() !== name.toLowerCase());
        renderTable(inventory);
        getStatusDiv().innerText = `Deleted: "${name}"`;
        getStatusDiv().style.color = "orange";
    }
};

// --- 8. Search and Filter Functions ---
// Fulfills the requirement for search functionality based on item name.
function searchItems(): void {
    const query = (document.getElementById('searchInput') as HTMLInputElement).value.toLowerCase();
    const results = inventory.filter(i => i.name.toLowerCase().includes(query));
    renderTable(results);
    getStatusDiv().innerText = `Results for search: "${query}"`;
}

// --- 9. Event Listeners Initialization ---
// Ensures the DOM is fully parsed before attaching behavioral logic to HTML elements.
window.addEventListener('DOMContentLoaded', () => {
    console.log("TypeScript system is running!");
    
    document.getElementById('btnAdd')?.addEventListener('click', addItem);
    document.getElementById('btnUpdate')?.addEventListener('click', updateItem);
    document.getElementById('btnSearch')?.addEventListener('click', searchItems);
    document.getElementById('btnShowAll')?.addEventListener('click', () => {
        renderTable(inventory);
        getStatusDiv().innerText = "Displaying all inventory items.";
    });
    document.getElementById('btnShowPopular')?.addEventListener('click', () => {
        const populars = inventory.filter(i => i.isPopular === 'Yes');
        renderTable(populars);
        getStatusDiv().innerText = "Filtering by popular items.";
    });
});