import { Component } from '@angular/core';
import { SessionStorageService } from '../../service/session-storage.service';

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrl: './user-account.component.css'
})

export class UserAccountComponent {
  current = this.sessionStorageService.getItem('userID');

  constructor(private sessionStorageService: SessionStorageService) {}

  find() {
    console.log(this.current);
  }
}
