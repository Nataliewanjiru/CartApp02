import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../service/user.service';
import { UserRegistrationAgentService, RegistrationResult } from '../../../service/user-registration-agent.service';
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
  isRegistering = false;

  
 constructor(
   public userService:UserService,
   public router: Router,
   private registrationAgent: UserRegistrationAgentService
 ){}

 ngOnInit(){

 }

 onSubmit(form: NgForm) {
  if (!form.valid) {
    return;
  }

  this.isRegistering = true;
  this.serverErrorMessages = undefined;
  
  console.log('Registering user:', form.value);
  
     this.registrationAgent.registerUser(form.value).subscribe({
     next: (result: RegistrationResult) => {
       this.isRegistering = false;
       if (result.success) {
         this.showSucessMessage = true;
         setTimeout(() => this.showSucessMessage = false, 4000);
         this.resetForm(form);
         this.router.navigate(['/login']);
       } else {
         if (result.validationErrors && result.validationErrors.length > 0) {
           this.serverErrorMessages = result.validationErrors.join('<br/>');
         } else {
           this.serverErrorMessages = result.error || 'Registration failed. Please try again.';
         }
       }
     },
     error: (err: any) => {
       this.isRegistering = false;
       console.error('Registration error:', err);
       this.serverErrorMessages = 'Something went wrong. Please contact admin.';
     }
   });
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
