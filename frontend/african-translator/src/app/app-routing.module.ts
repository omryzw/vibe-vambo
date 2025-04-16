import { Routes } from '@angular/router';
import { TranslatorComponent } from './components/translator/translator.component';

export const routes: Routes = [
  { path: '', redirectTo: '/translator', pathMatch: 'full' },
  { path: 'translator', component: TranslatorComponent }
]; 