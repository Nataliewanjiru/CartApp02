import { Injectable } from '@angular/core';
import { CartItem } from '../models/cart.model';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
 private memberArray=new BehaviorSubject<any[]>([]);
 memberships=this.memberArray.asObservable();
 private cartSessionKey = 'cartItems'; 

 

  constructor(private http:HttpClient ) { 
    
  }

  getMembers(array:string):Observable<any>{
    return this.http.get<any>(environment.apiBaseUrl+`/auth/users?${array}`);
  }

  assignMembers(array:any[]){
    this.memberArray.next(array)
  }


  create(token: string, groupId: string, itemData: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
   return this.http.post<any>(environment.apiBaseUrl + `/api/cart-items/${groupId}/addItem`,itemData, { headers });
  }

  update(key: string, value:any){

  }

  delete(groupId: string, itemId: string){
    return this.http.delete<any>(environment.apiBaseUrl + `/api/cart-items/${groupId}/${itemId}`);
  }



}
