import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { UserGroupsComponent } from '../user-groups/user-groups.component';
import { CartListComponent } from '../cart-list/cart-list.component';

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrl: './home-page.component.css',
    standalone: true,
    imports:[NavbarComponent,UserGroupsComponent,CartListComponent]
})
export class HomePageComponent {

}
