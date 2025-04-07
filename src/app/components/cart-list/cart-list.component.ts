import { Component,Input, ElementRef, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
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
  
}

processCartDetails() {
  if (this.cartgroupDetails && this.cartgroupDetails.length > 0 && this.cartgroupDetails[0].cartItems && this.cartgroupDetails[0].cartItems.length > 0) {
    this.addedBy = this.cartgroupDetails[0].cartItems[0].addedBy;
    this.userIds = [this.addedBy];
    this.fetchUsers();
  } else {
    console.error('Cart data is invalid or missing.');
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
  if(this.users){
    const user = this.users.find((u) => {
      return u._id === userId;
    });
    return user ? user.username : 'Unknown User';
  } else {
    return 'Unknown User';
  }
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
    if (this.cartgroupDetails && this.cartgroupDetails.length > 0 && this.cartgroupDetails[0]._id) {
      const itemData = {
        product: this.itemName,
        image: this.itemImage,
        quantity: this.itemQuantity,
        size: this.itemSize,
        color: this.itemColor,
        price: this.itemPrice,
      };

      console.log(itemData);

      this.CartService.create(token, this.cartgroupDetails[0]._id, itemData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res: any) => {
            console.log(res);
            this.display = false;
            Swal.fire({
              title: 'Success!',
              text: 'Item added to cart successfully',
              icon: 'success',
              confirmButtonText: 'OK',
              confirmButtonColor: '#A0522D',
              color: '#333333',
              titleClass: 'my-swal-title',
            } as SweetAlertOptions);

            this.display = false;
            this.refreshCartData();
          },
          error: (error: any) => { // error is here, not else.
            console.error(error);
            Swal.fire({
              title: 'Error!',
              text: 'Failed to add item to cart. Please try again.',
              icon: 'error',
              confirmButtonText: 'OK',
            });
          },
        });
    } else {
      console.error('Cart group details are invalid.');
      Swal.fire({
        title: 'Error!',
        text: 'Cart group details are invalid. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  }
}


refreshCartData(): void {
  const token = this.userService.getToken();
  if (token&&this.cartgroupDetails && this.cartgroupDetails.length > 0 && this.cartgroupDetails[0]._id) {
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
  if (token&&this.cartgroupDetails && this.cartgroupDetails.length > 0 && this.cartgroupDetails[0]._id) {
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
