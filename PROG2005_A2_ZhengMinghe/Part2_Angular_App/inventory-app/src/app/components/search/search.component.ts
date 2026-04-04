import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../../services/inventory.service';
import { InventoryItem } from '../../models/item.model';

@Component({
  selector: 'app-search', standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html'
})
export class SearchComponent implements OnInit {
  searchQuery: string = '';
  filteredItems: InventoryItem[] = [];

  constructor(private inventoryService: InventoryService) {}

  ngOnInit(): void { this.filteredItems = this.inventoryService.getItems(); }

  onSearch() {
    this.filteredItems = this.inventoryService.getItems().filter(item =>
      item.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  showPopular() { this.filteredItems = this.inventoryService.getPopularItems(); }
  showAll() { this.filteredItems = this.inventoryService.getItems(); }
}