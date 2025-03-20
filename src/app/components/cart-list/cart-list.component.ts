import { Component,OnInit } from '@angular/core';
import { GroupService } from '../../service/group.service';
import { UserService } from '../../service/user.service';

@Component({
    selector: 'app-cart-list',
    templateUrl: './cart-list.component.html',
    styleUrl: './cart-list.component.css',
    standalone: false
})
export class CartListComponent {
cartList:any[] = [];

constructor(public GroupService:GroupService, public  userService: UserService,) {}

ngOnInit(){
  this.GroupService.Chatlist.subscribe((data)=>{
    this.cartList=data
    console.log(data)
    console.log(this.cartList)
  })
}
}
