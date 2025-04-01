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
  private detailArray=new BehaviorSubject<any[]>([])
  groupDetails=this.detailArray.asObservable();
  private chatArray =new BehaviorSubject<any[]>([])
  Chatlist=this.chatArray.asObservable();

  updateChatList(array:any[]) {
    this.chatArray.next(array);
  }


  //Get all the groups
  getUserCartGroups(token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(environment.apiBaseUrl + '/api/cart-groups', { headers });
  }

  //makes sure the data of groups are put in currentGroup
  updateUserGroups(array:any[]) {
    this.arraySource.next(array);
  }

  //Functions for sending a form for new group

createCartGroup(token:string,data:any): Observable<any> {
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.post<any>(environment.apiBaseUrl + '/api/cart-groups',data, { headers });
}

//Functions on getting each group details individually
  
 //Get details for each group
  getCartGroupDetails(token:string,groupId:any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(environment.apiBaseUrl + `/api/cart-groups/${groupId}`, { headers });
  }

//Pushes these details to groupArray
  setGroupDetails(details:any[]){
    this.detailArray.next(details)
  }


}
