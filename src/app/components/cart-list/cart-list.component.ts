import { Component,OnInit } from '@angular/core';
import { CartService } from '../../service/cart.service';
import { CartItem } from '../../models/cart.model';
import { map } from 'rxjs';

@Component({
  selector: 'app-cart-list',
  templateUrl: './cart-list.component.html',
  styleUrl: './cart-list.component.css'
})
export class CartListComponent implements OnInit{
cartList?:CartItem[];
currentCart?:CartItem;
currentIndex = -1;
title='';

constructor(private cartService: CartService){}

ngOnInit(): void {
  this.retrieveCart()
}

refreshList(): void {
  this.currentCart = undefined;
  this.currentIndex = -1;
  this.retrieveCart();
}

retrieveCart():void{
  this.cartService.getAll().snapshotChanges().pipe(
    map(changes=>
      changes.map(c =>
        ({key:c.payload.key, ...c.payload.val()})
        )
      )
  ).subscribe(data =>{
    this.cartList =data;
  });
}

setActiveCart(cartItem:CartItem,index:number):void{
  this.currentCart =cartItem;
  this.currentIndex=index;
}

removeAllCart():void{
  this.cartService.deleteAll()
  .then(()=> this.refreshList())
  .catch(err =>console.log(err))
}
}
