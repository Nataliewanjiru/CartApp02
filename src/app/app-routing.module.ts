import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { UserComponent } from './components/user/user.component';
import { SignUpComponent } from './components/user/sign-up/sign-up.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { SigninComponent } from './components/user/signin/signin.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { CartListComponent } from './components/cart-list/cart-list.component';

const routes: Routes = [
 {path:'',component:HomePageComponent},

  {path: 'signup', component:UserComponent,
  children:[{path: '', component:SignUpComponent}]
  },

  {path: 'login', component:UserComponent,
 children:[{path: '', component:SigninComponent}]
  },
  {
    path: 'userprofile', component: UserProfileComponent
},
{path:'cartPage',component:CartListComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
