import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../service/user.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule


@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrl: './sign-up.component.css',
    providers: [UserService],
    imports: [CommonModule,FormsModule],
    standalone: true
})

export class SignUpComponent {
  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  showSucessMessage: boolean | undefined;
  serverErrorMessages: string | undefined;

  
 constructor(public userService:UserService,public router: Router){}

 ngOnInit(){

 }

 onSubmit(form: NgForm) {
  console.log(form)
  this.userService.postUser(form.value).subscribe(
    _res => {
      this.showSucessMessage = true;
      setTimeout(() => this.showSucessMessage = false, 4000);
      this.resetForm(form);
      this.router.navigate(['/login']);
    },
    err => {
      if (err.status === 422) {
        this.serverErrorMessages = err.error.join('<br/>');
      }
      else
        this.serverErrorMessages = 'Something went wrong.Please contact admin.';
    }
  )
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
}




resetForm(form: NgForm) {
  this.userService.selectedUser = {
    firstName: '',
    lastName:"",
    userName:"",
    email: '',
    password: ''
  };
  form.resetForm();
  this.serverErrorMessages = '';
}

}
