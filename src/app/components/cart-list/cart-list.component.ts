import { Component,Input, ElementRef, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { GroupService } from '../../service/group.service';
import { UserService } from '../../service/user.service';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'; 
import { NavbarComponent } from '../navbar/navbar.component';
import { CartService } from '../../service/cart.service';
import { takeUntil,Subject } from 'rxjs';
import Swal, { SweetAlertOptions } from 'sweetalert2';


@Component({
    selector: 'app-cart-list',
    templateUrl: './cart-list.component.html',
    styleUrl: './cart-list.component.css',
    standalone: true,
    imports: [CommonModule, FormsModule,NavbarComponent]
})
export class CartListComponent  implements AfterViewInit{
  cartgroupDetails: any[] = [];
  @Input() addedBy: string = ''; // Input property for addedBy
  userName: string = 'Unknown User'; // Default value
  userIds: string[] = []; 
  users: any[] = [];
  display=false;
  itemName: string = ''; 
  itemQuantity:number =0;
  itemImage:string='';
  itemSize: string = ''; 
  itemColor:string =''
  itemPrice:string=''

  private destroy$ = new Subject<void>();

constructor(public GroupService:GroupService, public  userService: UserService,private el: ElementRef, @Inject(PLATFORM_ID) private platformId: Object,public CartService:CartService) {}

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

ngOnInit() {
  if (isPlatformBrowser(this.platformId)) { // Check if in browser
    const storedData = sessionStorage.getItem('cartData');
    if (storedData) {
      this.cartgroupDetails = JSON.parse(storedData);
      this.processCartDetails();
    } else {
      this.GroupService.groupDetails.subscribe((data) => {
        this.cartgroupDetails = data;
        sessionStorage.setItem('cartData', JSON.stringify(data));
        this.processCartDetails();
      });
    }
  } else {
    // Server-side logic (if needed)
    this.GroupService.groupDetails.subscribe((data) => {
      this.cartgroupDetails = data;
      this.processCartDetails();
    });
  }
  console.log(this.cartgroupDetails[0]._id)
}

processCartDetails() {
  if (
    this.cartgroupDetails[0]
  ) {
    this.addedBy = this.cartgroupDetails[0].cartItems[0].addedBy;
    this.userIds = [this.addedBy];
    this.fetchUsers();
  } else {
    console.error('addedBy is undefined or cartItems is missing or empty');
    this.userIds = [];
    this.fetchUsers();
  }
}




fetchUsers(){
   //create a query string of the userIds.
   const queryString = this.userIds.map(id => `userId=${id}`).join('&');
   //fetch the users from the API.
   this.CartService.getMembers(queryString).subscribe(
    (response:any) => {
      console.log(response)
      this.CartService.assignMembers(response)
      this.CartService.memberships.subscribe(array =>this.users=array)
      this.userName = this.getUserName(this.addedBy);
    },
     (error) => {
        console.error('Error fetching users:', error);
        this.userName = 'Error User';
      }
   )
}


getUserName(userId: string): string {
  const user = this.users.find((u) => {
    return u._id === userId;
  });
  return user ? user.username : 'Unknown User';
}

cancelForm(){
  this.display=false
}

 itemForm(){
  this.display=true
}
 
submitGroup(): void {
  const token = this.userService.getToken();
  if (token) {
    const itemData = {
      product: this.itemName, // Use 'name' to match your backend
      image: this.itemImage, // Use 'image'
      quantity: this.itemQuantity,
      size: this.itemSize,
      color: this.itemColor,
      price: this.itemPrice, // Adjust to number if necessary
    };

    console.log(itemData);

    this.CartService.create(token, this.cartgroupDetails[0]._id,itemData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          console.log(res);
          this.display = false; // Hide the form
          Swal.fire({
            title: 'Success!',
            text: 'Item added to cart successfully',
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#A0522D',
            color: '#333333',
            titleClass: 'my-swal-title',
          } as SweetAlertOptions);
          
          this.display=false;
          // Refresh the cart data here.
          this.refreshCartData();
        },
        error: (error:any) => {
          console.error(error);
          Swal.fire({
            title: 'Error!',
            text: 'Failed to add item to cart. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        },
      });
  }
}


refreshCartData(): void {
  const token = this.userService.getToken();
  if (token) {
    this.GroupService.getCartGroupDetails(token,this.cartgroupDetails[0]._id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (items: any[]) => {
          // Update cart items in component and UI.
          console.log('Cart items refreshed', items);
          sessionStorage.removeItem('cartData')
          sessionStorage.setItem('cartData', JSON.stringify(items));
            window.location.reload();
        },
        error: (error) => {
          console.error('Error refreshing cart items', error);
        },
      });
  }
}

ngOnDestroy(): void {
  this.destroy$.next();
  this.destroy$.complete();
}



deleteItem(itemId: string) {
  const token = this.userService.getToken();
  if (token) {
    console.log('Deleting item with ID:', itemId); // Log the itemId
    this.CartService.delete(this.cartgroupDetails[0]._id, itemId) // Correct backend service call
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          Swal.fire({
            title: 'Success!',
            text: 'Item deleted',
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#A0522D',
            color: '#333333',
            titleClass: 'my-swal-title',
          } as SweetAlertOptions);
          this.refreshCartData();
        },
        error: (error: any) => {
          console.error('Error deleting item from backend', error);
        },
      });
  }
}
}
