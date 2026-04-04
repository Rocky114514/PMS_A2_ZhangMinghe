import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ManageComponent } from './components/manage/manage.component';
// ... 其他组件导入

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'manage', component: ManageComponent },
  // ... 其他路由
  { path: '', redirectTo: '/home', pathMatch: 'full' } // 默认进入首页
];