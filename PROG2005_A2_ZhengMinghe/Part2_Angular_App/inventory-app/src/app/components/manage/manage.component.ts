//24833060-202300408073-张洺赫MingheZhang
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { InventoryService } from '../../services/inventory.service';
import { InventoryItem } from '../../models/item.model';

/**
 * ManageComponent: Provides the administrative interface for inventory CRUD operations.
 * Fulfills the requirement for a dedicated page to add, edit, and delete items.
 */
@Component({
  selector: 'app-manage', standalone: true, 
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './manage.component.html'
})
export class ManageComponent implements OnInit {
  itemForm: FormGroup;
  statusMessage: string = '';

  // Local data structure to store inventory records fetched from the service
  inventoryList: InventoryItem[] = []; 

  constructor(public inventoryService: InventoryService) {
    /** 
     * Initializes the Reactive Form with strict validation rules.
     * Enforces the requirement that numeric fields must not accept letters 
     * using regex patterns (Validators.pattern).
     */
    this.itemForm = new FormGroup({
      id: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      category: new FormControl('', Validators.required),
      quantity: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
      price: new FormControl('', [Validators.required, Validators.pattern("^[0-9.]*$")]),
      supplierName: new FormControl('', Validators.required),
      stockStatus: new FormControl('In Stock', Validators.required),
      isPopular: new FormControl('No', Validators.required),
      comment: new FormControl('')
    });
  }

   ngOnInit(): void {
    this.refreshList(); // Synchronize view with persistent data structure on load
  }

  // Pre-fills the form with existing item data to facilitate the 'Update' workflow (ULO2)
  onEdit(item: InventoryItem) {
  this.itemForm.patchValue(item);
  this.statusMessage = `Editing: ${item.name}. Update values and click 'Update by Name'.`;
  }
  
  // Refreshes the local component state to reflect changes in the shared service
  refreshList() {
    this.inventoryList = this.inventoryService.getItems();
  }

  // Logic to add new items while enforcing Data Integrity (Unique ID check)
  onAdd() {
    if (this.itemForm.valid && this.inventoryService.addItem(this.itemForm.value)) {
      this.statusMessage = 'Item Added Successfully!';
      this.itemForm.reset();
      this.refreshList();
    } else {
      this.statusMessage = 'Error: Duplicate ID or Invalid Data!';
    }
  }

  // Fulfills the specific requirement: Updating must be performed using the 'Item Name'
  onUpdate() {
    const name = this.itemForm.get('name')?.value;
    if (this.inventoryService.updateItemByName(name, this.itemForm.value)) {
      this.statusMessage = 'Item Updated Successfully!';
    } else {
      this.statusMessage = 'Error: Item Name Not Found!';
    }
  }

  // Implementation of a confirmation prompt before deletion to ensure user-centred safety (ULO2)
  onDelete(name: string) {
    if (confirm(`Delete ${name}?`)) {
      this.inventoryService.deleteItemByName(name);
      this.refreshList();
    }
  }
}