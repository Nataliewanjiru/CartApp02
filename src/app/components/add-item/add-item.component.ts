import { Component } from '@angular/core';
import { CartItem } from '../../models/cart.model';
import { CartService } from '../../service/cart.service';

@Component({
    selector: 'app-add-item',
    templateUrl: './add-item.component.html',
    styleUrl: './add-item.component.css',
    standalone: false
})
export class AddItemComponent {
   cartItem:CartItem = new CartItem();
   submitted =false;

   constructor(private cartService: CartService){}

   saveCart(): void{
    this.cartService.create(this.cartItem).then(() =>{
      console.log('Created new item successfully!');
      this.submitted=true;
    })
   }

   newCart(): void {
    this.submitted = false;
    this.cartItem = new CartItem();
   }
}
