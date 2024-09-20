import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {
  constructor() { }

  getItem(key: string): any {
    try {
      const result = JSON.parse(sessionStorage.getItem(key) || '{}');
      return result;
    } catch (error: any) {
      console.error(error);
      return null;
    }
  }

  setItem(key: string, value: any): void {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  }

  removeItem(key: string): void {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error(error);
    }
  }

  clearEntireSession(): void {
    sessionStorage.clear();
  }
}
