// Student ID: 24833060 - Name: Zhang Minghe (张洺赫)
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// IMPORTANT: FormsModule is required for [(ngModel)] usage in the rename UI
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { InventoryService } from '../../services/inventory.service';
import { InventoryItem } from '../../models/item.model';

/**
 * ManageComponent: Provides the administrative interface for inventory CRUD operations.
 * This version includes an advanced two-step renaming workflow to ensure data integrity (ULO1).
 */
@Component({
  selector: 'app-manage', 
  standalone: true, 
  // Added FormsModule to the imports array to support template-driven binding in the rename panel
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './manage.component.html',
  styleUrl: './manage.component.css'
})
export class ManageComponent implements OnInit {
  itemForm: FormGroup;
  statusMessage: string = '';
  inventoryList: InventoryItem[] = []; 

  // UI State Variables: Controls the visibility and data flow of the renaming panel (ULO2)
  showRenameUI = false;
  isRenameActive = false;
  tempNewName = '';

  constructor(public inventoryService: InventoryService) {
    /** 
     * Initializes the Reactive Form with strict validation rules.
     * Enforces the requirement that numeric fields must not accept letters using regex.
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
    this.refreshList(); // Synchronize view with persistent service data on load
  }

  // Pre-fills the form with existing item data and triggers user guidance (ULO2)
  onEdit(item: InventoryItem) {
    this.itemForm.patchValue(item);
    this.statusMessage = `Editing: ${item.name}. Update values and click 'Update / Rename'.`;
  }
  
  refreshList() {
    this.inventoryList = this.inventoryService.getItems();
  }

  // Standard Add Logic: Checks for form validity and ID uniqueness (Data Integrity)
  onAdd() {
    if (this.itemForm.valid && this.inventoryService.addItem(this.itemForm.value)) {
      this.statusMessage = 'Item Added Successfully!';
      this.itemForm.reset();
      this.refreshList();
    } else {
      this.statusMessage = 'Error: Duplicate ID or Invalid Data!';
    }
  }

  /**
   * Toggle logic for the renaming interface.
   * Ensures a target Item Name is selected before revealing additional UI controls.
   */
  toggleRenameOption() {
    const currentName = this.itemForm.get('name')?.value;
    if (!currentName) {
      this.statusMessage = "Error: Please select or enter an Item Name to update/rename.";
      return;
    }
    this.showRenameUI = !this.showRenameUI;
  }

  /**
   * Final Update Logic: Handles both simple property updates and Item Name modifications.
   * Uses a conditional branch to determine if the 'Item Name' should be overridden (ULO2).
   */
  onFinalUpdate() {
    const currentName = this.itemForm.get('name')?.value;
    
    // Branch for Renaming: Merges new name into the form object before calling the service
    if (this.isRenameActive && this.tempNewName) {
      const updatedData = { ...this.itemForm.value, name: this.tempNewName };
      if (this.inventoryService.updateItemByName(currentName, updatedData)) {
        this.statusMessage = `Successfully renamed ${currentName} to ${this.tempNewName}`;
        this.resetRenameUI();
      }
    } else {
      // Standard Update: Keeps the original name and only updates attributes
      if (this.inventoryService.updateItemByName(currentName, this.itemForm.value)) {
        this.statusMessage = `Updated details for ${currentName}`;
        this.resetRenameUI();
      }
    }
    this.refreshList();
  }

  // Resets all UI states and clears the form to provide a fresh entry state (UX Best Practice)
  resetRenameUI() {
    this.showRenameUI = false;
    this.isRenameActive = false;
    this.tempNewName = '';
    this.itemForm.reset();
  }

  // Implementation of confirmation prompt to prevent accidental data loss (ULO2)
  onDelete(name: string) {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      this.inventoryService.deleteItemByName(name);
      this.refreshList();
    }
  }
}