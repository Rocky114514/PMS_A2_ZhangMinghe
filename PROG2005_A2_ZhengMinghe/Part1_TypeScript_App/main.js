"use strict";
// 24833060-202300408073-张洺赫MingheZhang
/**
 * PROG2005 Programming Mobile Systems - Assessment 2 (Part 1)
 * Technical implementation of a standalone inventory management system.
 * This script handles dynamic DOM rendering, complex data validation,
 * and a secure two-step renaming workflow to ensure data integrity.
 */
// --- 2. Global State Management ---
// maintains a structured data model in-memory for session-based persistence.
let inventory = [];
// Variable to track the original name during the renaming workflow to avoid logical conflicts.
let nameToUpdate = "";
// Utility functions for safe DOM element retrieval and explicit type casting.
const getStatusDiv = () => document.getElementById('status-message');
const getDisplayDiv = () => document.getElementById('inventory-display');
// --- 3. Core Function: Dynamic Table Rendering ---
// Renders the internal data structure into a responsive HTML table using innerHTML.
function renderTable(data) {
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
function addItem() {
    const statusDiv = getStatusDiv();
    const idInput = document.getElementById('itemId');
    const nameInput = document.getElementById('itemName');
    const categoryInput = document.getElementById('itemCategory');
    const qtyInput = document.getElementById('itemQuantity');
    const priceInput = document.getElementById('itemPrice');
    const supplierInput = document.getElementById('supplierName');
    const statusInput = document.getElementById('stockStatus');
    const isPopInput = document.querySelector('input[name="isPopular"]:checked');
    const commentInput = document.getElementById('itemComment');
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
    const newItem = {
        id: idInput.value.trim(),
        name: nameInput.value.trim(),
        category: categoryInput.value,
        quantity: parseInt(qtyInput.value),
        price: parseFloat(priceInput.value),
        supplierName: supplierInput.value.trim(),
        stockStatus: statusInput.value,
        isPopular: isPopInput.value,
        comment: commentInput.value.trim()
    };
    inventory.push(newItem);
    renderTable(inventory);
    statusDiv.innerText = `Success: Added "${newItem.name}" to inventory.`;
    statusDiv.style.color = "green";
    document.getElementById('inventory-form').reset();
}
/**
 * --- 5. Core Function: Update Workflow (Enhanced) ---
 * Implements a two-step process: Reveal Rename UI -> Finalize Changes.
 * This addresses the 'Update by Name' requirement while allowing secure renaming.
 */
function handleUpdateTrigger() {
    const renameContainer = document.getElementById('rename-container');
    const nameInput = document.getElementById('itemName').value.trim();
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
    }
    else {
        // Phase 2: Execute the actual data structure update.
        executeFinalUpdate();
    }
}
// Internal function to perform the array modification and UI cleanup.
function executeFinalUpdate() {
    const currentInputName = document.getElementById('itemName').value.trim();
    const isRenameEnabled = document.getElementById('enableRename').checked;
    const newNameVal = document.getElementById('newItemName').value.trim();
    // Locates the object using the locked name identifier from Step 1.
    const index = inventory.findIndex(i => i.name.toLowerCase() === nameToUpdate.toLowerCase());
    if (index === -1) {
        getStatusDiv().innerText = `Error: Item "${nameToUpdate}" not found!`;
        return;
    }
    // Logic for conditional renaming based on user selection (ULO2).
    if (isRenameEnabled && newNameVal) {
        inventory[index].name = newNameVal;
    }
    else {
        inventory[index].name = currentInputName;
    }
    // Syncing remaining fields from the form to the data object.
    inventory[index].category = document.getElementById('itemCategory').value;
    inventory[index].quantity = parseInt(document.getElementById('itemQuantity').value) || 0;
    inventory[index].price = parseFloat(document.getElementById('itemPrice').value) || 0;
    inventory[index].supplierName = document.getElementById('supplierName').value.trim();
    inventory[index].stockStatus = document.getElementById('stockStatus').value;
    inventory[index].isPopular = document.querySelector('input[name="isPopular"]:checked').value;
    inventory[index].comment = document.getElementById('itemComment').value.trim();
    getStatusDiv().innerText = `Success: Updated details for "${inventory[index].name}"`;
    getStatusDiv().style.color = "green";
    // UI Reset: Hides renaming panel and clears temporary states.
    document.getElementById('rename-container').style.display = 'none';
    document.getElementById('enableRename').checked = false;
    document.getElementById('new-name-box').style.display = 'none';
    document.getElementById('newItemName').value = "";
    renderTable(inventory);
}
// --- 6. Edit Logic: User-Centred Form Pre-filling (ULO2) ---
window.editItem = (name) => {
    const item = inventory.find(i => i.name.toLowerCase() === name.toLowerCase());
    if (item) {
        document.getElementById('itemId').value = item.id;
        document.getElementById('itemName').value = item.name;
        document.getElementById('itemCategory').value = item.category;
        document.getElementById('itemQuantity').value = item.quantity.toString();
        document.getElementById('itemPrice').value = item.price.toString();
        document.getElementById('supplierName').value = item.supplierName;
        document.getElementById('stockStatus').value = item.stockStatus;
        const popYes = document.getElementById('popYes');
        const popNo = document.getElementById('popNo');
        if (item.isPopular === 'Yes')
            popYes.checked = true;
        else
            popNo.checked = true;
        document.getElementById('itemComment').value = item.comment || '';
        const statusDiv = getStatusDiv();
        statusDiv.innerText = `Mode: Editing "${name}". Use Update to save or rename.`;
        statusDiv.style.color = "#3498db";
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};
// --- 7. Delete Logic: Safe Deletion with Confirmation (ULO2) ---
window.deleteItem = (name) => {
    if (confirm(`Are you sure you want to delete "${name}" from inventory?`)) {
        inventory = inventory.filter(i => i.name.toLowerCase() !== name.toLowerCase());
        renderTable(inventory);
        getStatusDiv().innerText = `Deleted: "${name}"`;
        getStatusDiv().style.color = "orange";
    }
};
// --- 8. Search and Filter Functions ---
function searchItems() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const results = inventory.filter(i => i.name.toLowerCase().includes(query));
    renderTable(results);
    getStatusDiv().innerText = `Showing results for: "${query}"`;
}
// --- 9. Initialization and Event Binding ---
window.addEventListener('DOMContentLoaded', () => {
    var _a, _b, _c, _d, _e, _f;
    console.log("TypeScript system is running!");
    // Attaching behavioral logic to UI elements once the DOM is ready.
    (_a = document.getElementById('btnAdd')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', addItem);
    (_b = document.getElementById('btnUpdate')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', handleUpdateTrigger);
    // Checkbox listener to toggle renaming input field visibility.
    (_c = document.getElementById('enableRename')) === null || _c === void 0 ? void 0 : _c.addEventListener('change', (e) => {
        const box = document.getElementById('new-name-box');
        box.style.display = e.target.checked ? 'block' : 'none';
    });
    (_d = document.getElementById('btnSearch')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', searchItems);
    (_e = document.getElementById('btnShowAll')) === null || _e === void 0 ? void 0 : _e.addEventListener('click', () => {
        renderTable(inventory);
        getStatusDiv().innerText = "Displaying all inventory items.";
    });
    (_f = document.getElementById('btnShowPopular')) === null || _f === void 0 ? void 0 : _f.addEventListener('click', () => {
        const populars = inventory.filter(i => i.isPopular === 'Yes');
        renderTable(populars);
        getStatusDiv().innerText = "Filtering by popular items.";
    });
});
