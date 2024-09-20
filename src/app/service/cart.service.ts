import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { CartItem } from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private dbPath = '/cart';

  cartsRef:AngularFireList<CartItem>

  constructor(private db:AngularFireDatabase) { 
    this.cartsRef=db.list(this.dbPath);
  }

  getAll():AngularFireList<CartItem>{
    return this.cartsRef;
  }

  create(cartItem:CartItem):any{
    return this.cartsRef.push(cartItem);
  }

  update(key: string, value:any):Promise<void>{
    return this.cartsRef.update(key,value);
  }

  delete(key:string):Promise<void>{
    return this.cartsRef.remove(key);
  }

  deleteAll():Promise<void>{
    return this.cartsRef.remove();
  }
}
