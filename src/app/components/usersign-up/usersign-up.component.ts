import { Component } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { UserService } from '../../service/user.service';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
import { SessionStorageService } from '../../service/session-storage.service';


@Component({
  selector: 'app-usersign-up',
  templateUrl: './usersign-up.component.html',
  styleUrl: './usersign-up.component.css'
})
export class UsersignUpComponent {
  userModel:User = new User();
  submitted=false;


  constructor(public authService: AuthService, public userService: UserService,private _router: Router,private sessionStorageService: SessionStorageService) {
    
  }

  async signup() {
    try {
      // Sign up the user using authService
      this.authService.signup(this.userModel.email!, this.userModel.password!);
  
      // Create a new object that excludes the password
      const userDataToCreate = {
        email: this.userModel.email!,
        username: this.userModel.username!,
        phoneNumber: this.userModel.phoneNumber!
      };
       

      // Create the user using userService
      const createdUser = await this.userService.create(userDataToCreate);

     
  
      console.log(createdUser._delegate._path.pieces_[1]);
      this.userModel.email = this.userModel.password = '';
      this.submitted = true;
      this._router.navigateByUrl('useraccount');
      this.sessionStorageService.setItem('userID', createdUser._delegate._path.pieces_[1]);
    } catch (error) {
      console.error('Error signing up or creating user:', error);
    }
  }
  

  login() {
    this.authService.login(this.userModel.email!, this.userModel.password!);
    this.userModel.email = this.userModel.password = '';    
  }

  logout() {
    this.authService.logout();
  }
}
