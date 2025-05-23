import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { IgxIconModule, IgxNavbarModule, IgxButtonModule } from "igniteui-angular";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { environment } from '../environments/environment';
import { provideHttpClient, withFetch } from '@angular/common/http';
//components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddItemComponent } from './components/add-item/add-item.component';
import { CartitemsDetailsComponent } from './components/cartitems-details/cartitems-details.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { UserComponent } from './components/user/user.component';
import { SigninComponent } from './components/user/signin/signin.component';

@NgModule({
  declarations: [
    AppComponent,
    AddItemComponent,
    CartitemsDetailsComponent,
    UserComponent,
    SigninComponent,
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
    provideHttpClient(withFetch()),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}