import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  postUser(user: User){
    return this.http.post(environment.apiBaseUrl+'/register',user);
  }

  selectedUser:any ={
    firstName:"",
    lastName:"",
    userName:"",
    email:"",
    password:"",
    familyID:"",
  };

  constructor(public http: HttpClient) { }
}
