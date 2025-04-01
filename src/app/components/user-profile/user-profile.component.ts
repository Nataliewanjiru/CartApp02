import { Component, OnInit, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../service/user.service';
import { User } from '../../models/user.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component'; 
import { NgModule } from '@angular/core';



@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.css'],
    standalone: true,
    imports: [CommonModule,NavbarComponent]
})

export class UserProfileComponent implements OnInit {
    userDetails: User | null = null;

    constructor(public userService: UserService, public router: Router ,private modalService: NgbModal) {}

    public open(modal: any): void {
        this.modalService.open(modal);
      }
    
    
    ngOnInit() {
        const token = this.userService.getToken()
        if (token) {
            this.userService.getUserProfile(token).subscribe(
                (res:any)=> {
                  this.userDetails = res["message"];
                },
                (err:any)=> { 
                  console.log(err);
                  
                }
              );
     
        } else {
            console.log('No token found, redirecting to login.');
            this.router.navigate(['/login']);
        }
      
    }

    onLogout() {
        this.userService.deleteToken();
        this.router.navigate(['/login']);
    }
}
