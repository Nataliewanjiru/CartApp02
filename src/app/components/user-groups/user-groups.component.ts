import { Component , ElementRef, AfterViewInit, Inject, PLATFORM_ID,OnDestroy} from '@angular/core';
import { GroupService } from '../../service/group.service';
import { Group } from '../../models/group.model';
import { Router } from '@angular/router';
import { UserService } from '../../service/user.service';
import { User } from '../../models/user.model';
import { NgForm } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { thisMonth } from '@igniteui/material-icons-extended';
import Swal, { SweetAlertOptions } from 'sweetalert2';
import { Subscription, takeUntil, Subject } from 'rxjs';




@Component({
    selector: 'app-user-groups',
    templateUrl: './user-groups.component.html',
    styleUrl: './user-groups.component.css',
    standalone: false
})
export class UserGroupsComponent implements AfterViewInit, OnDestroy{
  userGroups:any[] = []; 
  display=false
  appPeople:any[]=[];
  filteredPeople:any[]=[]
  searchTerm: string = '';
  displayDropdown: boolean = false; 
  selectedMembers: any[] = []; 
  groupName: string = ''; 
  description:string =''
  groupImage:string=''

     
  constructor(public  userService: UserService,public GroupService: GroupService,public router : Router,private el: ElementRef, @Inject(PLATFORM_ID) private platformId: Object ) { }
   
  private destroy$ = new Subject<void>();

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  ngOnInit() {
    const token = this.userService.getToken()
   if (token) {
       this.GroupService.getUserCartGroups(token).subscribe(
           (res:any)=> {
            console.log(token)
            console.log(res)
             this.GroupService.updateUserGroups(res)
             this.GroupService.currentGroups.subscribe(array => {
               this.userGroups= array;
             });

             console.log(this.userGroups)
           },
         );
        
   } else {
       console.log('No token found, redirecting to login.');
       this.router.navigate(['/login']);
   }
  
}

ngAfterViewInit(): void {
  if (isPlatformBrowser(this.platformId)) { // Run only in the browser
    import('bootstrap').then((bs) => {
      const carouselElement = this.el.nativeElement.querySelector('#carouselExampleControlsNoTouching')
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

cancelGroup(){
  this.display=false
}

 groupForm(){
  this.display=true

  const token = this.userService.getToken()
  if (token) {
    const groupId = this.GroupService.getGroupId()
      this.GroupService.getCartGroupMembers(token,groupId).subscribe(
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
   
  submitGroup(): void {
    const token = this.userService.getToken();
    if (token) {
      const groupData = {
        groupName: this.groupName,
        description: this.description,
        groupImage: this.groupImage,
      };
      console.log(groupData);
      this.GroupService.createCartGroup(token, groupData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res: any) => {
            console.log(res);
            this.display = false;
            Swal.fire({
              title: 'Success!',
              text: 'Group created successfully',
              icon: 'success',
              confirmButtonText: 'OK',
              confirmButtonColor: '##A0522D',
              color: '#333333',
              titleClass: 'my-swal-title',
            } as SweetAlertOptions); // Explicit type cast
            this.GroupService.getUserCartGroups(token)
              .pipe(takeUntil(this.destroy$))
              .subscribe({
                next: (groups: any[]) => {
                  this.userGroups = groups;
                },
                error: (error) => {
                  console.error('Error fetching groups:', error);
                  Swal.fire({
                    title: 'Error!',
                    text: 'Failed to fetch groups.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                  });
                },
              });
          },
          error: (error) => {
            console.error(error);
            Swal.fire({
              title: 'Error!',
              text: 'Failed to create group. Please try again.',
              icon: 'error',
              confirmButtonText: 'OK',
            });
          },
        });
    }
  }
  }