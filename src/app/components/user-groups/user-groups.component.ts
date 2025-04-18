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
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 


@Component({
    selector: 'app-user-groups',
    templateUrl: './user-groups.component.html',
    styleUrl: './user-groups.component.css',
    standalone: true,
    imports: [CommonModule,FormsModule]
})
export class UserGroupsComponent implements AfterViewInit, OnDestroy{
  userGroups:any[] = []; 
  filteredGroups:any[]=[]
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
    sessionStorage.removeItem('cartData');
       this.GroupService.getUserCartGroups(token).subscribe(
           (res:any)=> {
            console.log(res[0])
             this.GroupService.updateUserGroups(res[0])
             this.GroupService.currentGroups.subscribe(array => {
               this.userGroups= array;
               
             });
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
  
  filterGroups() {
  this.GroupService.currentGroups.subscribe(array => {
        this.userGroups=array.filter(group=>group.groupName.toLowerCase().includes(this.searchTerm.toLowerCase()))
        this.userGroups = [...this.userGroups]; 
  
        setTimeout(() => {
          const items = document.querySelectorAll('.carousel-item');
          items.forEach(item => item.classList.remove('active'));
          if (items.length > 0) {
            items[0].classList.add('active'); // Make first visible item active
          }
        });
    });
  }


  cancelGroup(){
    this.display=false
  }
  
   groupForm(){
    this.display=true
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
            window.location.reload();
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

  onCardClick(groupId: string) {
    const token = this.userService.getToken();
    if(token && groupId){
    this.GroupService.getCartGroupDetails(token,groupId).subscribe(
      (res: any) => {
        console.log(res);
        this.GroupService.setGroupDetails(res);
        this.router.navigate(['/cartPage'])
        },
        (error: any) => {
          console.error(error);
          }
    )
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
    
  }