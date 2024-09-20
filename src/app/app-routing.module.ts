import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserAccountComponent } from './components/user-account/user-account.component';
import { AppComponent } from './app.component';
import { HomePageComponent } from './components/home-page/home-page.component';

const routes: Routes = [
  {path: '', component:HomePageComponent},
  {path: 'useraccount', component:UserAccountComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
