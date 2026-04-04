import { Component, OnInit } from '@angular/core';
// 1. 导入服务和模型
import { InventoryService } from '../../services/inventory.service';
import { InventoryItem } from '../../item.model';
import { CommonModule } from '@angular/common'; // 用于循环显示数据

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule], // 导入 CommonModule 以便在 HTML 中使用 *ngFor
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  // 2. 定义一个本地变量来存储从 Service 获取的数据
  displayItems: InventoryItem[] = [];

  // 3. 核心步骤：依赖注入
  // 这一行代码告诉 Angular：“请把我的 InventoryService 拿给这个组件用”
  constructor(private inventoryService: InventoryService) {}

  ngOnInit(): void {
    // 4. 组件初始化时，从 Service 获取数据
    this.displayItems = this.inventoryService.getItems();
    console.log('Successfully loaded items from Service:', this.displayItems);
  }
}