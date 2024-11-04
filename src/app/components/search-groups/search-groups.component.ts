import { Component } from '@angular/core';
import { GroupService } from '../../service/group.service';
import { UserService } from '../../service/user.service';


@Component({
  selector: 'app-search-groups',
  templateUrl: './search-groups.component.html',
  styleUrl: './search-groups.component.css'
})
export class SearchGroupsComponent {
  filteredGroupList: any[] = [];
  searchTerm: string = '';

  ngOnInit() {
    this.GroupService.currentGroups.subscribe(array => {
      this.filteredGroupList= array;
    });
  }
  constructor(public GroupService:GroupService, public userService:UserService) {}

  filterGroups() {
    // Get the original array from the service
    this.GroupService.currentGroups.subscribe(array => {
      this.filteredGroupList = array.filter(group =>
        group.chatName.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    });
  }

  openGroup(group:any){
    const token = this.userService.getToken()
    const chatID=group._id
    if (token) {
    this.GroupService.getCartForGroup(token,chatID).subscribe((data)=>{
      this.GroupService.updateChatList(data)
      console.log(data)
    })
    }
  }
}