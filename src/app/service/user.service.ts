import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import  { jwtDecode } from 'jwt-decode';





interface DecodedToken {
  user_id: string; // Adjust based on the structure of your token
  // Add other properties if needed
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  postUser(user: User){
    return this.http.post(environment.apiBaseUrl + '/auth/register',user);
  }

  selectedUser:any ={
    firstname:"",
    lastname:"",
    username:"",
    email:"",
    password:"",
  };

  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };

  constructor(private http: HttpClient) { }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  login(authCredentials: any) {
    return this.http.post(environment.apiBaseUrl + '/auth/login', authCredentials,this.noAuthHeader);
  }  

  getUserProfile(token: string): Observable<any> { // Specify the return type as Observable<any>
    return this.http.get<any>(environment.apiBaseUrl + '/auth/profile',{
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
        })
    });
}


private decodeTokenLib(token: string): DecodedToken {
    return Decode<DecodedToken>(token);
}


  //Helper Methods

  setToken(token: string) {
    if (this.isBrowser()){
    localStorage.setItem('token', token);
  }}
 
  getToken(): string | null {
    if (this.isBrowser()) {
      return localStorage.getItem('token');
    }
    return null;
  }  

  deleteToken() {
    if (this.isBrowser()){
    localStorage.removeItem('token');
  }}

  getUserPayload() {
    var token = this.getToken();
    if (token) {
      var userPayload = atob(token.split('.')[1]);
      return JSON.parse(userPayload);
    }
    else
      return null;
  }

  isLoggedIn() {
    var userPayload = this.getUserPayload();
    if (userPayload)
      return userPayload.exp > Date.now() / 1000;
    else
      return false;
  }

}
function Decode<T>(token: string): T {
  return jwtDecode<T>(token);
}
