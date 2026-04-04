import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { InventoryService } from '../../services/inventory.service';
import { InventoryItem } from '../../models/item.model';

@Component({
  selector: 'app-manage', standalone: true, 
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './manage.component.html'
})
export class ManageComponent implements OnInit {
  itemForm: FormGroup;
  statusMessage: string = '';

  inventoryList: InventoryItem[] = []; 

  constructor(public inventoryService: InventoryService) {
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
    this.refreshList();
  }
  
  refreshList() {
    this.inventoryList = this.inventoryService.getItems();
  }

  onAdd() {
    if (this.itemForm.valid && this.inventoryService.addItem(this.itemForm.value)) {
      this.statusMessage = 'Item Added Successfully!';
      this.itemForm.reset();
      this.refreshList();
    } else {
      this.statusMessage = 'Error: Duplicate ID or Invalid Data!';
    }
  }

  onUpdate() {
    const name = this.itemForm.get('name')?.value;
    if (this.inventoryService.updateItemByName(name, this.itemForm.value)) {
      this.statusMessage = 'Item Updated Successfully!';
    } else {
      this.statusMessage = 'Error: Item Name Not Found!';
    }
  }

  onDelete(name: string) {
    if (confirm(`Delete ${name}?`)) {
      this.inventoryService.deleteItemByName(name);
      this.refreshList();
    }
  }
}