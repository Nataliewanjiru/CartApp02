import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AuthService } from './service/auth.service';
import { IgxIconModule,IgxNavbarModule,IgxButtonModule} from "igniteui-angular";

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddItemComponent } from './components/add-item/add-item.component';
import { CartitemsDetailsComponent } from './components/cartitems-details/cartitems-details.component';
import { CartListComponent } from './components/cart-list/cart-list.component';
import { UsersignUpComponent } from './components/usersign-up/usersign-up.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomePageComponent } from './components/home-page/home-page.component';
import { UserAccountComponent } from './components/user-account/user-account.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    AddItemComponent,
    CartitemsDetailsComponent,
    CartListComponent,
    UsersignUpComponent,
    NavbarComponent,
    HomePageComponent,
    UserAccountComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    BrowserAnimationsModule,
    IgxNavbarModule,
    IgxButtonModule,
    IgxIconModule,
  ],
  providers: [
    provideClientHydration(),
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
