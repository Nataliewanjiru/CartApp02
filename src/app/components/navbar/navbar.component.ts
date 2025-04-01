import { Component,ViewEncapsulation  } from '@angular/core';
import { IgxIconModule,IgxNavbarModule } from 'igniteui-angular';
import { RouterModule } from '@angular/router';

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css',
    standalone: true,
    imports: [IgxIconModule,IgxNavbarModule,RouterModule]
})
export class NavbarComponent {
  

}
