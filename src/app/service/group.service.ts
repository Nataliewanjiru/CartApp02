import { Injectable } from '@angular/core';
import { Group } from '../models/group.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import  { jwtDecode } from 'jwt-decode';
import { BehaviorSubject } from 'rxjs';


interface DecodedToken {
  user_id: string; 

}

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(private http: HttpClient) { }

  private arraySource = new BehaviorSubject<any[]>([]);
  currentGroups = this.arraySource.asObservable();

  selectedGroup:any ={
    chatName: "",
    isGroupChat:"",
    users: "",
    latestMessages: [],
    groupAdmin: "",
  };
  private chatArray =new BehaviorSubject<any[]>([])
  Chatlist=this.chatArray.asObservable();

  updateChatList(array:any[]) {
    this.chatArray.next(array);
  }

  updateUserGroups(array:any[]) {
    this.arraySource.next(array);
  }


//  getUserGroups(token: string): Observable<any> {
//    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
//    return this.http.get<any>('http://localhost:3002/api/group', { headers });
//}


private peopleArray= new BehaviorSubject<any[]>([]);
currentPeople = this.peopleArray.asObservable();

updateAppPeople(array:any[]) {
  this.peopleArray.next(array);
}

  createGroup(token:string,data:any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>('http://localhost:3002/api/creategroup',data, { headers });
  }
  
  getAppMembers(token:string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>('http://localhost:3002/api/users', { headers });
  }

  getCartForGroup(token:string,data:any){
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`http://localhost:3002/api//message/${data}`,{headers});
  }
}
