//24833060-202300408073-张洺赫MingheZhang
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; 
import { InventoryService } from '../../services/inventory.service';
import { InventoryItem } from '../../models/item.model';

/**
 * HomeComponent: Acts as the landing view and dashboard for the application.
 * It provides a high-level overview of the inventory status to the user.
 */
@Component({
  selector: 'app-home',
  standalone: true, // Implements the modern Standalone Component pattern (ULO2)
  imports: [CommonModule, RouterLink], // Required for structural directives (*ngFor) and navigation
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  // Local array used to bind and display data in the dashboard template
  displayItems: InventoryItem[] = [];

  // Injects the shared InventoryService to access session-based data structures
  constructor(private inventoryService: InventoryService) {}

  /**
   * Lifecycle Hook: Triggered when the component initializes.
   * Fetches the current inventory list from the service to update the dashboard count.
   */
  ngOnInit(): void {
    this.displayItems = this.inventoryService.getItems();
  }
}