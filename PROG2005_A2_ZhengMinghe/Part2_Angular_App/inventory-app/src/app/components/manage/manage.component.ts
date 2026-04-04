import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { InventoryService } from '../../services/inventory.service';
import { InventoryItem } from '../../item.model';

@Component({
  selector: 'app-manage',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './manage.component.html',
  styleUrl: './manage.component.css'
})
export class ManageComponent implements OnInit {
  itemForm: FormGroup;
  inventoryList: InventoryItem[] = [];
  statusMessage: string = '';

  constructor(private inventoryService: InventoryService) {
    // 初始化表单，并添加验证规则
    this.itemForm = new FormGroup({
      id: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      category: new FormControl('', Validators.required),
      // 验证数字字段：只接受数字
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

  // --- 添加功能 ---
  onAdd() {
    if (this.itemForm.valid) {
      const success = this.inventoryService.addItem(this.itemForm.value);
      if (success) {
        this.statusMessage = 'Success: Item added to database.';
        this.itemForm.reset();
        this.refreshList();
      } else {
        this.statusMessage = 'Error: Duplicate ID found!';
      }
    } else {
      this.statusMessage = 'Error: Please fill all required fields correctly.';
    }
  }

  // --- 更新功能 (按名称) ---
  onUpdate() {
    const itemName = this.itemForm.get('name')?.value;
    if (itemName) {
      const success = this.inventoryService.updateItemByName(itemName, this.itemForm.value);
      if (success) {
        this.statusMessage = `Success: Updated details for ${itemName}`;
        this.refreshList();
      } else {
        this.statusMessage = 'Error: Item name not found for update.';
      }
    }
  }

  // --- 删除功能 (按名称，带确认框) ---
  onDelete(name: string) {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      this.inventoryService.deleteItemByName(name);
      this.statusMessage = `Deleted: ${name}`;
      this.refreshList();
    }
  }
}