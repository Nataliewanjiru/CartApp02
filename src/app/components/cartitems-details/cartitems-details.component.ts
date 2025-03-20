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
    if (this.currentCart.key) {
      this.cartService.update(this.currentCart.key, { published: status })
      .then(() => {
        this.currentCart.published = status;
        this.message = 'The status was updated successfully!';
      })
      .catch(err => console.log(err));
    }
  }

  updateCartItem(): void {
    const data = {
      title: this.currentCart.title,
      description: this.currentCart.description
    };

    if (this.currentCart.key) {
      this.cartService.update(this.currentCart.key, data)
        .then(() => this.message = 'The item was updated successfully!')
        .catch(err => console.log(err));
    }
  }

  deleteCartItem(): void {
    if (this.currentCart.key) {
      this.cartService.delete(this.currentCart.key)
        .then(() => {
          this.refreshList.emit();
          this.message = 'The tutorial was deleted successfully!';
        })
        .catch(err => console.log(err));
    }
  }
}
