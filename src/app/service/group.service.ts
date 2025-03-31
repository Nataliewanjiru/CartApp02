import { Injectable } from '@angular/core';
import { Group } from '../models/group.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
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
  private groupIdSource = new BehaviorSubject<string | null>(null);
  currentGroups = this.arraySource.asObservable();

  selectedGroup:any ={
    groupName: "",
    description:"",
    groupImage:"",
    members: [],
    cartgroupItems: [],
    createdAt: "",
  };
  private chatArray =new BehaviorSubject<any[]>([])
  Chatlist=this.chatArray.asObservable();

  updateChatList(array:any[]) {
    this.chatArray.next(array);
  }

  updateUserGroups(array:any[]) {
    this.arraySource.next(array);
  }


  getUserCartGroups(token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(environment.apiBaseUrl + '/api/cart-groups', { headers });
}


private peopleArray= new BehaviorSubject<any[]>([]);
currentPeople = this.peopleArray.asObservable();

updateAppPeople(array:any[]) {
  this.peopleArray.next(array);
}

createCartGroup(token:string,data:any): Observable<any> {
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.post<any>(environment.apiBaseUrl + '/api/cart-groups',data, { headers });
}
  
  getCartGroupMembers(token:string,groupId:any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`http://localhost:3002/api/${groupId}`, { headers });
  }

  getCartForGroup(token:string,data:any){
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`http://localhost:3002/api/message/${data}`,{headers});
  }

  groupId$ = this.groupIdSource.asObservable();

  setGroupId(groupId: string) {
    this.groupIdSource.next(groupId);
    localStorage.setItem('currentGroupId', groupId); // Persist selection
  }

  getGroupId(): string | null {
    return localStorage.getItem('currentGroupId'); // Retrieve from storage
  }


}
