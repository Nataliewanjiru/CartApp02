import { Component,OnInit, ElementRef, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { GroupService } from '../../service/group.service';
import { UserService } from '../../service/user.service';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'; 
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
    selector: 'app-cart-list',
    templateUrl: './cart-list.component.html',
    styleUrl: './cart-list.component.css',
    standalone: true,
    imports: [CommonModule, FormsModule,NavbarComponent]
})
export class CartListComponent  implements AfterViewInit{
  cartgroupDetails: any[] = [];

constructor(public GroupService:GroupService, public  userService: UserService,private el: ElementRef, @Inject(PLATFORM_ID) private platformId: Object ) {}

ngAfterViewInit(): void {
  if (isPlatformBrowser(this.platformId)) { // Run only in the browser
    import('bootstrap').then((bs) => {
      const carouselElement = this.el.nativeElement.querySelector('#carouselExampleControlsNoTouching');
      if (carouselElement) {
        new bs.Carousel(carouselElement, {
          touch: true,
          interval: 3000
        });
      }
    });
  }
}

onCardClick(cardTitle: string) {
  alert(`You clicked on: ${cardTitle}`);
}
ngOnInit(){
  this.GroupService.groupDetails.subscribe((data)=>{
    this.cartgroupDetails=[data]
    console.log([data])
    console.log(this.cartgroupDetails)
  })
}
}
