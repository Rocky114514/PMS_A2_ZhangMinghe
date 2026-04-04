import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ManageComponent } from './components/manage/manage.component';
import { SearchComponent } from './components/search/search.component';
import { SecurityComponent } from './components/security/security.component';
import { HelpComponent } from './components/help/help.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'manage', component: ManageComponent },
  { path: 'search', component: SearchComponent },
  { path: 'security', component: SecurityComponent },
  { path: 'help', component: HelpComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];