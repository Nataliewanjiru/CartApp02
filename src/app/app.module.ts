import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { IgxIconModule,IgxNavbarModule,IgxButtonModule} from "igniteui-angular";

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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireDatabaseModule,
    BrowserAnimationsModule,
    IgxNavbarModule,
    IgxButtonModule,
    IgxIconModule,
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch())
   
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
