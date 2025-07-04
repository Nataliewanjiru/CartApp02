import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UserRegistrationAgentService, RegistrationAnalytics, BulkRegistrationResult } from '../../../service/user-registration-agent.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-registration-dashboard',
  templateUrl: './registration-dashboard.component.html',
  styleUrls: ['./registration-dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class RegistrationDashboardComponent implements OnInit, OnDestroy {
  analytics: RegistrationAnalytics = {
    totalRegistrations: 0,
    todayRegistrations: 0,
    weeklyRegistrations: 0,
    monthlyRegistrations: 0,
    failureRate: 0,
    topErrorReasons: []
  };

  queuedUsersCount = 0;
  isProcessingQueue = false;
  bulkRegistrationResult: BulkRegistrationResult | null = null;
  
  // Bulk registration form
  bulkUsersText = '';
  selectedFile: File | null = null;
  
  // Single user registration
  newUser: User = {
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
    userpicture: '',
    groups: []
  };

  private subscriptions: Subscription[] = [];

  constructor(private registrationAgent: UserRegistrationAgentService) {}

  ngOnInit(): void {
    this.loadAnalytics();
    this.loadQueuedUsersCount();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private loadAnalytics(): void {
    const analyticsSubscription = this.registrationAgent.getAnalytics().subscribe(
      (analytics: RegistrationAnalytics) => {
        this.analytics = analytics;
      }
    );
    this.subscriptions.push(analyticsSubscription);
  }

  private loadQueuedUsersCount(): void {
    const queueSubscription = this.registrationAgent.getQueuedUsersCount().subscribe(
      (count: number) => {
        this.queuedUsersCount = count;
      }
    );
    this.subscriptions.push(queueSubscription);
  }

  registerSingleUser(): void {
    const registrationSubscription = this.registrationAgent.registerUser(this.newUser).subscribe(
      (result) => {
        if (result.success) {
          alert('User registered successfully!');
          this.resetNewUser();
          this.loadAnalytics();
        } else {
          alert(`Registration failed: ${result.error}`);
        }
      }
    );
    this.subscriptions.push(registrationSubscription);
  }

  queueUser(): void {
    this.registrationAgent.queueUserForRegistration(this.newUser);
    this.resetNewUser();
    this.loadQueuedUsersCount();
    alert('User added to registration queue!');
  }

  processQueue(): void {
    if (this.queuedUsersCount === 0) {
      alert('No users in queue to process.');
      return;
    }

    this.isProcessingQueue = true;
    const processSubscription = this.registrationAgent.processRegistrationQueue().subscribe(
      (result: BulkRegistrationResult) => {
        this.isProcessingQueue = false;
        this.bulkRegistrationResult = result;
        this.loadAnalytics();
        this.loadQueuedUsersCount();
        alert(`Processed ${result.totalProcessed} users: ${result.successful} successful, ${result.failed} failed`);
      },
      (error) => {
        this.isProcessingQueue = false;
        alert('Error processing queue: ' + error.message);
      }
    );
    this.subscriptions.push(processSubscription);
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      this.selectedFile = file;
    } else {
      alert('Please select a valid CSV file.');
    }
  }

  uploadBulkUsers(): void {
    if (!this.selectedFile) {
      alert('Please select a CSV file first.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const csvData = e.target?.result as string;
      const users = this.parseCsvData(csvData);
      
      if (users.length > 0) {
        const bulkSubscription = this.registrationAgent.registerBulkUsers(users).subscribe(
          (result: BulkRegistrationResult) => {
            this.bulkRegistrationResult = result;
            this.loadAnalytics();
            alert(`Bulk registration complete: ${result.successful} successful, ${result.failed} failed`);
          },
          (error) => {
            alert('Error during bulk registration: ' + error.message);
          }
        );
        this.subscriptions.push(bulkSubscription);
      }
    };
    reader.readAsText(this.selectedFile);
  }

  processBulkUsersText(): void {
    if (!this.bulkUsersText.trim()) {
      alert('Please enter user data.');
      return;
    }

    const users = this.parseTextData(this.bulkUsersText);
    
    if (users.length > 0) {
      const bulkSubscription = this.registrationAgent.registerBulkUsers(users).subscribe(
        (result: BulkRegistrationResult) => {
          this.bulkRegistrationResult = result;
          this.loadAnalytics();
          this.bulkUsersText = '';
          alert(`Bulk registration complete: ${result.successful} successful, ${result.failed} failed`);
        },
        (error) => {
          alert('Error during bulk registration: ' + error.message);
        }
      );
      this.subscriptions.push(bulkSubscription);
    }
  }

  private parseCsvData(csvData: string): User[] {
    const lines = csvData.split('\n');
    const users: User[] = [];
    
    // Skip header row if present
    const dataLines = lines.slice(1);
    
    dataLines.forEach(line => {
      const columns = line.split(',');
      if (columns.length >= 4) {
        const user: User = {
          firstname: columns[0]?.trim() || '',
          lastname: columns[1]?.trim() || '',
          email: columns[2]?.trim() || '',
          password: columns[3]?.trim() || '',
          username: columns[4]?.trim() || '',
          userpicture: '',
          groups: []
        };
        
        if (user.firstname && user.lastname && user.email && user.password) {
          users.push(user);
        }
      }
    });
    
    return users;
  }

  private parseTextData(textData: string): User[] {
    const lines = textData.split('\n');
    const users: User[] = [];
    
    lines.forEach(line => {
      const parts = line.split(',');
      if (parts.length >= 4) {
        const user: User = {
          firstname: parts[0]?.trim() || '',
          lastname: parts[1]?.trim() || '',
          email: parts[2]?.trim() || '',
          password: parts[3]?.trim() || '',
          username: parts[4]?.trim() || '',
          userpicture: '',
          groups: []
        };
        
        if (user.firstname && user.lastname && user.email && user.password) {
          users.push(user);
        }
      }
    });
    
    return users;
  }

  exportRegistrationData(): void {
    const exportSubscription = this.registrationAgent.exportRegistrationData().subscribe(
      (data) => {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'registration-data.json';
        link.click();
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        alert('Error exporting data: ' + error.message);
      }
    );
    this.subscriptions.push(exportSubscription);
  }

  private resetNewUser(): void {
    this.newUser = {
      firstname: '',
      lastname: '',
      username: '',
      email: '',
      password: '',
      userpicture: '',
      groups: []
    };
  }

  getSuccessRate(): number {
    return Math.round((1 - this.analytics.failureRate) * 100);
  }

  refreshAnalytics(): void {
    this.loadAnalytics();
    this.loadQueuedUsersCount();
  }
}