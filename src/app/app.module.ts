import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { IgxIconModule,IgxNavbarModule,IgxButtonModule} from "igniteui-angular";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { environment } from '../environments/environment';
import { provideHttpClient, withFetch } from '@angular/common/http';
//components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddItemComponent } from './components/add-item/add-item.component';
import { CartitemsDetailsComponent } from './components/cartitems-details/cartitems-details.component';
import { CartListComponent } from './components/cart-list/cart-list.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomePageComponent } from './components/home-page/home-page.component';
import { RouterModule } from '@angular/router';
import { UserComponent } from './components/user/user.component';
import { SignUpComponent } from './components/user/sign-up/sign-up.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { SigninComponent } from './components/user/signin/signin.component';
import { GroupDispalySectionComponent } from './components/group-dispaly-section/group-dispaly-section.component';
import { UserGroupsComponent } from './components/user-groups/user-groups.component';
import { SearchGroupsComponent } from './components/search-groups/search-groups.component';



@NgModule({
  declarations: [
    AppComponent,
    AddItemComponent,
    CartitemsDetailsComponent,
    CartListComponent,
    NavbarComponent,
    HomePageComponent,
    UserComponent,
    SignUpComponent,
    UserProfileComponent,
    SigninComponent,
    GroupDispalySectionComponent,
    UserGroupsComponent,
    SearchGroupsComponent,
  ],
  imports: [
    RouterModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireDatabaseModule,
    BrowserAnimationsModule,
    IgxNavbarModule,
    IgxButtonModule,
    IgxIconModule,
    NgbModule,
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch())
   
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
