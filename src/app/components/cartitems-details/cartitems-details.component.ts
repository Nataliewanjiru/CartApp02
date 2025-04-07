import { Component, Input,Output, EventEmitter } from '@angular/core';
import { CartItem } from '../../models/cart.model';
import { CartService } from '../../service/cart.service';


@Component({
    selector: 'app-cartitems-details',
    templateUrl: './cartitems-details.component.html',
    styleUrl: './cartitems-details.component.css',
    standalone: false
})
export class CartitemsDetailsComponent {
  @Input() cart?: CartItem;
  @Output() refreshList: EventEmitter<any> = new EventEmitter();
  currentCart: CartItem = {
    title: '',
    description: '',
    published: false
  };
  message = '';
  
  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.message = '';
  }

  ngOnChanges(): void {
    this.message = '';
    this.currentCart = { ...this.cart };
  }

  updatePublished(status: boolean): void {
  }

  updateCartItem(): void {

  }

  deleteCartItem(): void {
  }
}
