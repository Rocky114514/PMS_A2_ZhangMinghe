//24833060-202300408073-张洺赫MingheZhang
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../../services/inventory.service';
import { InventoryItem } from '../../models/item.model';

/**
 * SearchComponent: Manages the inventory lookup and filtering logic.
 * This component fulfills the specific requirement for an item search page 
 * with multiple filtering options (Assessment Page 2).
 */
@Component({
  selector: 'app-search', standalone: true,
  imports: [CommonModule, FormsModule], // FormsModule enables Template-driven features for the search input
  templateUrl: './search.component.html'
})
export class SearchComponent implements OnInit {
  // Application state for the search query and the subset of filtered data
  searchQuery: string = '';
  filteredItems: InventoryItem[] = [];

  constructor(private inventoryService: InventoryService) {}

  // Lifecycle Hook: Synchronizes the view with the global inventory structure upon initialization
  ngOnInit(): void { this.filteredItems = this.inventoryService.getItems(); }

  /**
   * Main Search Logic: Performs case-insensitive filtering based on Item Name.
   * This real-time update improves interface intuitiveness and responsiveness (ULO2).
   */
  onSearch() {
    this.filteredItems = this.inventoryService.getItems().filter(item =>
      item.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  // Mandatory Filter: Retrieves only "Popular Items" as specified in the feature list
  showPopular() { this.filteredItems = this.inventoryService.getPopularItems(); }

  // Resets the filter to display the comprehensive database of inventory items
  showAll() { this.filteredItems = this.inventoryService.getItems(); }
}