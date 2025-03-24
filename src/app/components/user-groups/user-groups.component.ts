import { Component } from '@angular/core';
import { GroupService } from '../../service/group.service';
import { Group } from '../../models/group.model';
import { Router } from '@angular/router';
import { UserService } from '../../service/user.service';
import { User } from '../../models/user.model';
import { NgForm } from '@angular/forms';


@Component({
    selector: 'app-user-groups',
    templateUrl: './user-groups.component.html',
    styleUrl: './user-groups.component.css',
    standalone: false
})
export class UserGroupsComponent {
  userGroups:any[] = []; 
  display=false
  appPeople:any[]=[];
  filteredPeople:any[]=[]
  searchTerm: string = '';
  displayDropdown: boolean = false; 
  selectedMembers: any[] = []; 
  groupName: string = ''; 

     
  constructor(public  userService: UserService,public GroupService: GroupService,public router : Router) { }
   
  ngOnInit() {
    const token = this.userService.getToken()
   //if (token) {
   //    this.GroupService.getUserGroups(token).subscribe(
   //        (res:any)=> {
   //          this.GroupService.updateUserGroups(res)
   //          this.GroupService.currentGroups.subscribe(array => {
   //            this.userGroups= array;
   //          });

   //          console.log(this.userGroups)
   //        },
   //      );
   //     
   //} else {
   //    console.log('No token found, redirecting to login.');
   //    this.router.navigate(['/login']);
   //}
  
}

cancelGroup(){
  this.display=false
}

 groupForm(){
  this.display=true

  const token = this.userService.getToken()
  if (token) {
      this.GroupService.getAppMembers(token).subscribe(
          (res:any)=> {
            this.GroupService.updateAppPeople(res["message"])
            this.GroupService.currentPeople.subscribe(array => {
              this.appPeople= array;
            });
            console.log(this.appPeople)
          },
        );
       
  } else {
      console.log('No token found, redirecting to login.');
      this.router.navigate(['/login']);
  }
}

filterUsers(): void {
    if (this.searchTerm.trim() === '') {
      this.filteredPeople = [];
      this.displayDropdown = false;
    } else {
      this.filteredPeople = this.appPeople.filter(person =>
        person.firstname.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
      this.displayDropdown = this.filteredPeople.length > 0;
    }
  }

  selectPerson(person: any): void {
    // Check if the person is already selected
    if (!this.selectedMembers.some(member => member._id === person._id)) {
      this.selectedMembers.push(person); // Add person to selected members
    }
    this.searchTerm = ''; // Clear search term
    this.filteredPeople = []; // Clear filtered results
    this.displayDropdown = false; // Hide dropdown
  }

  removeMember(person: any): void {
    this.selectedMembers = this.selectedMembers.filter(member => member._id !== person._id);
  }

  submitGroup():void{
    const token = this.userService.getToken()
    if (token) {
      const groupData = {
        name: this.groupName,
        usersString: JSON.stringify(this.selectedMembers),
      };
      this.GroupService.createGroup(token,groupData).subscribe(
        (res:any) => {
          console.log(res);
          },
          (error) => {
            console.error(error);
            }
            );
  }

}
}
