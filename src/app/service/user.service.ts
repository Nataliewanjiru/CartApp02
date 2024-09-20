import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { User } from '../models/user.model'; 

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private dbPath = '/users';

  usersRef: AngularFireList<User>;
  userRef!: AngularFireObject<User>;

  constructor(private db: AngularFireDatabase) {
    this.usersRef = db.list(this.dbPath);
  }

  getAll(): AngularFireList<User> {
    return this.usersRef;
  }

  get(userId: string): AngularFireObject<User> {
    this.userRef = this.db.object(`${this.dbPath}/${userId}`);
    return this.userRef;
  }

  create(user: User): any {
    return this.usersRef.push(user);
  }

  update(userId: string, value: any): Promise<void> {
    return this.usersRef.update(`${userId}`, value);
  }

  delete(userId: string): Promise<void> {
    return this.usersRef.remove(`${userId}`);
  }

  deleteAll(): Promise<void> {
    return this.usersRef.remove();
  }
}
