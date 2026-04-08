// 24833060-202300408073-张洺赫MingheZhang
/**
 * PROG2005 Programming Mobile Systems - Assessment 2 (Part 1)
 * Technical implementation of a standalone inventory management system.
 * This script handles dynamic DOM rendering, complex data validation, 
 * and a secure two-step renaming workflow to ensure data integrity.
 */

// --- 1. Data Model Definition (ULO1: Type Enforcement) ---
// Defines a strict interface to maintain data integrity across the system.
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
// maintains a structured data model in-memory for session-based persistence.
let inventory: InventoryItem[] = [];
// Variable to track the original name during the renaming workflow to avoid logical conflicts.
let nameToUpdate: string = ""; 

// Utility functions for safe DOM element retrieval and explicit type casting.
const getStatusDiv = () => document.getElementById('status-message') as HTMLDivElement;
const getDisplayDiv = () => document.getElementById('inventory-display') as HTMLDivElement;

// --- 3. Core Function: Dynamic Table Rendering ---
// Renders the internal data structure into a responsive HTML table using innerHTML.
function renderTable(data: InventoryItem[]): void {
    const displayDiv = getDisplayDiv();
    if (data.length === 0) {
        displayDiv.innerHTML = '<p class="empty-msg">No records found matching criteria.</p>';
        return;
    }

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
                    <button onclick="editItem('${item.name}')" style="background: #3498db; color: white; padding: 5px 10px; margin-right:5px; font-size:12px;">Edit</button>
                    <button onclick="deleteItem('${item.name}')" style="background: #e74c3c; color: white; padding: 5px 10px; font-size:12px;">Delete</button>
                </td>
            </tr>`;
    });

    html += '</tbody></table>';
    displayDiv.innerHTML = html;
}

// --- 4. Core Function: Add New Item ---
// Implements mandatory field validation and unique ID constraints (ULO1).
function addItem(): void {
    const statusDiv = getStatusDiv();

    const idInput = document.getElementById('itemId') as HTMLInputElement;
    const nameInput = document.getElementById('itemName') as HTMLInputElement;
    const categoryInput = document.getElementById('itemCategory') as HTMLSelectElement;
    const qtyInput = document.getElementById('itemQuantity') as HTMLInputElement;
    const priceInput = document.getElementById('itemPrice') as HTMLInputElement;
    const supplierInput = document.getElementById('supplierName') as HTMLInputElement;
    const statusInput = document.getElementById('stockStatus') as HTMLSelectElement;
    const isPopInput = document.querySelector('input[name="isPopular"]:checked') as HTMLInputElement;
    const commentInput = document.getElementById('itemComment') as HTMLTextAreaElement;

    // Fulfills the requirement: All fields except 'comment' require values.
    if (!idInput.value || !nameInput.value || !categoryInput.value || !qtyInput.value || !priceInput.value || !supplierInput.value) {
        statusDiv.innerText = "Error: All starred (*) fields are required.";
        statusDiv.style.color = "red";
        return;
    }

    // Constraint check: Ensures Item ID is unique across the dataset.
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

/**
 * --- 5. Core Function: Update Workflow (Enhanced) ---
 * Implements a two-step process: Reveal Rename UI -> Finalize Changes.
 * This addresses the 'Update by Name' requirement while allowing secure renaming.
 */
function handleUpdateTrigger(): void {
    const renameContainer = document.getElementById('rename-container')!;
    const nameInput = (document.getElementById('itemName') as HTMLInputElement).value.trim();

    if (!nameInput) {
        getStatusDiv().innerText = "Error: Please enter the Item Name first.";
        getStatusDiv().style.color = "red";
        return;
    }

    // Phase 1: Show the renaming UI and capture the target identifier.
    if (renameContainer.style.display === 'none' || renameContainer.style.display === '') {
        nameToUpdate = nameInput; // Locking the original name for data lookup.
        renameContainer.style.display = 'block';
        getStatusDiv().innerText = `Step 1: Renaming "${nameToUpdate}". Set New Name and click Update again.`;
        getStatusDiv().style.color = "#3498db";
    } else {
        // Phase 2: Execute the actual data structure update.
        executeFinalUpdate();
    }
}

// Internal function to perform the array modification and UI cleanup.
function executeFinalUpdate(): void {
    const currentInputName = (document.getElementById('itemName') as HTMLInputElement).value.trim();
    const isRenameEnabled = (document.getElementById('enableRename') as HTMLInputElement).checked;
    const newNameVal = (document.getElementById('newItemName') as HTMLInputElement).value.trim();

    // Locates the object using the locked name identifier from Step 1.
    const index = inventory.findIndex(i => i.name.toLowerCase() === nameToUpdate.toLowerCase());

    if (index === -1) {
        getStatusDiv().innerText = `Error: Item "${nameToUpdate}" not found!`;
        return;
    }

    // Logic for conditional renaming based on user selection (ULO2).
    if (isRenameEnabled && newNameVal) {
        inventory[index].name = newNameVal;
    } else {
        inventory[index].name = currentInputName;
    }

    // Syncing remaining fields from the form to the data object.
    inventory[index].category = (document.getElementById('itemCategory') as HTMLSelectElement).value as any;
    inventory[index].quantity = parseInt((document.getElementById('itemQuantity') as HTMLInputElement).value) || 0;
    inventory[index].price = parseFloat((document.getElementById('itemPrice') as HTMLInputElement).value) || 0;
    inventory[index].supplierName = (document.getElementById('supplierName') as HTMLInputElement).value.trim();
    inventory[index].stockStatus = (document.getElementById('stockStatus') as HTMLSelectElement).value as any;
    inventory[index].isPopular = (document.querySelector('input[name="isPopular"]:checked') as HTMLInputElement).value as any;
    inventory[index].comment = (document.getElementById('itemComment') as HTMLTextAreaElement).value.trim();

    getStatusDiv().innerText = `Success: Updated details for "${inventory[index].name}"`;
    getStatusDiv().style.color = "green";
    
    // UI Reset: Hides renaming panel and clears temporary states.
    document.getElementById('rename-container')!.style.display = 'none';
    (document.getElementById('enableRename') as HTMLInputElement).checked = false;
    document.getElementById('new-name-box')!.style.display = 'none';
    (document.getElementById('newItemName') as HTMLInputElement).value = "";
    
    renderTable(inventory);
}

// --- 6. Edit Logic: User-Centred Form Pre-filling (ULO2) ---
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
        statusDiv.innerText = `Mode: Editing "${name}". Use Update to save or rename.`;
        statusDiv.style.color = "#3498db";
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

// --- 7. Delete Logic: Safe Deletion with Confirmation (ULO2) ---
(window as any).deleteItem = (name: string) => {
    if (confirm(`Are you sure you want to delete "${name}" from inventory?`)) {
        inventory = inventory.filter(i => i.name.toLowerCase() !== name.toLowerCase());
        renderTable(inventory);
        getStatusDiv().innerText = `Deleted: "${name}"`;
        getStatusDiv().style.color = "orange";
    }
};

// --- 8. Search and Filter Functions ---
function searchItems(): void {
    const query = (document.getElementById('searchInput') as HTMLInputElement).value.toLowerCase();
    const results = inventory.filter(i => i.name.toLowerCase().includes(query));
    renderTable(results);
    getStatusDiv().innerText = `Showing results for: "${query}"`;
}

// --- 9. Initialization and Event Binding ---
window.addEventListener('DOMContentLoaded', () => {
    console.log("TypeScript system is running!");
    
    // Attaching behavioral logic to UI elements once the DOM is ready.
    document.getElementById('btnAdd')?.addEventListener('click', addItem);
    document.getElementById('btnUpdate')?.addEventListener('click', handleUpdateTrigger);
    
    // Checkbox listener to toggle renaming input field visibility.
    document.getElementById('enableRename')?.addEventListener('change', (e) => {
        const box = document.getElementById('new-name-box')!;
        box.style.display = (e.target as HTMLInputElement).checked ? 'block' : 'none';
    });

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