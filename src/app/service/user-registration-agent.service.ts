import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, from, of } from 'rxjs';
import { map, switchMap, catchError, tap } from 'rxjs/operators';
import { User } from '../models/user.model';
import { UserService } from './user.service';
import { environment } from '../../environments/environment';

export interface RegistrationResult {
  success: boolean;
  user?: User;
  error?: string;
  validationErrors?: string[];
}

export interface BulkRegistrationResult {
  totalProcessed: number;
  successful: number;
  failed: number;
  results: RegistrationResult[];
}

export interface RegistrationAnalytics {
  totalRegistrations: number;
  todayRegistrations: number;
  weeklyRegistrations: number;
  monthlyRegistrations: number;
  failureRate: number;
  topErrorReasons: string[];
}

export interface RegistrationConfig {
  requireEmailVerification: boolean;
  passwordMinLength: number;
  allowSpecialCharacters: boolean;
  requiredFields: string[];
  autoGenerateUsername: boolean;
  sendWelcomeEmail: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserRegistrationAgentService {
  private registrationQueue$ = new BehaviorSubject<User[]>([]);
  private analytics$ = new BehaviorSubject<RegistrationAnalytics>({
    totalRegistrations: 0,
    todayRegistrations: 0,
    weeklyRegistrations: 0,
    monthlyRegistrations: 0,
    failureRate: 0,
    topErrorReasons: []
  });

  private defaultConfig: RegistrationConfig = {
    requireEmailVerification: true,
    passwordMinLength: 8,
    allowSpecialCharacters: true,
    requiredFields: ['firstname', 'lastname', 'email', 'password'],
    autoGenerateUsername: false,
    sendWelcomeEmail: true
  };

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) {
    this.initializeAnalytics();
  }

  /**
   * Advanced user registration with comprehensive validation and error handling
   */
  registerUser(user: User, config?: Partial<RegistrationConfig>): Observable<RegistrationResult> {
    const finalConfig = { ...this.defaultConfig, ...config };
    
         return from(this.validateUser(user, finalConfig)).pipe(
       switchMap((validationResult: {isValid: boolean, errors: string[]}) => {
         if (!validationResult.isValid) {
           return of({
             success: false,
             error: 'Validation failed',
             validationErrors: validationResult.errors
           });
         }

         const processedUser = this.preprocessUser(user, finalConfig);
         return this.userService.postUser(processedUser).pipe(
           map((response: any) => ({
             success: true,
             user: processedUser
           })),
           catchError((error: any) => of({
             success: false,
             error: this.handleRegistrationError(error)
           }))
         );
       }),
       tap((result: RegistrationResult) => this.updateAnalytics(result))
    );
  }

  /**
   * Bulk user registration for importing multiple users
   */
  registerBulkUsers(users: User[], config?: Partial<RegistrationConfig>): Observable<BulkRegistrationResult> {
    const finalConfig = { ...this.defaultConfig, ...config };
    const results: RegistrationResult[] = [];
    
    return from(users).pipe(
             switchMap((user: User) => this.registerUser(user, finalConfig)),
       tap((result: RegistrationResult) => results.push(result)),
       map(() => {
        const successful = results.filter(r => r.success).length;
        const failed = results.length - successful;
        
        return {
          totalProcessed: results.length,
          successful,
          failed,
          results
        };
      })
    );
  }

  /**
   * Queue users for batch processing
   */
  queueUserForRegistration(user: User): void {
    const currentQueue = this.registrationQueue$.value;
    this.registrationQueue$.next([...currentQueue, user]);
  }

  /**
   * Process queued users
   */
  processRegistrationQueue(config?: Partial<RegistrationConfig>): Observable<BulkRegistrationResult> {
    const queuedUsers = this.registrationQueue$.value;
    this.registrationQueue$.next([]); // Clear queue
    
    return this.registerBulkUsers(queuedUsers, config);
  }

  /**
   * Validate user data before registration
   */
  private async validateUser(user: User, config: RegistrationConfig): Promise<{isValid: boolean, errors: string[]}> {
    const errors: string[] = [];

    // Check required fields
    for (const field of config.requiredFields) {
      if (!user[field as keyof User] || user[field as keyof User] === '') {
        errors.push(`${field} is required`);
      }
    }

    // Email validation
    if (user.email && !this.isValidEmail(user.email)) {
      errors.push('Invalid email format');
    }

    // Password validation
    if (user.password && user.password.length < config.passwordMinLength) {
      errors.push(`Password must be at least ${config.passwordMinLength} characters`);
    }

    // Check for duplicate email/username
    try {
      const isDuplicate = await this.checkForDuplicates(user);
      if (isDuplicate) {
        errors.push('Email or username already exists');
      }
    } catch (error) {
      console.warn('Could not check for duplicates:', error);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Preprocess user data before registration
   */
  private preprocessUser(user: User, config: RegistrationConfig): User {
    const processedUser = { ...user };

    // Auto-generate username if needed
    if (config.autoGenerateUsername && !processedUser.username) {
      processedUser.username = this.generateUsername(processedUser.firstname, processedUser.lastname);
    }

    // Set creation timestamp
    processedUser.createdAt = new Date().toISOString();

    // Initialize groups array
    if (!processedUser.groups) {
      processedUser.groups = [];
    }

    return processedUser;
  }

  /**
   * Generate username from first and last name
   */
  private generateUsername(firstname: string, lastname: string): string {
    const base = `${firstname.toLowerCase()}${lastname.toLowerCase()}`;
    const randomSuffix = Math.floor(Math.random() * 1000);
    return `${base}${randomSuffix}`;
  }

  /**
   * Email validation
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Check for duplicate users
   */
  private async checkForDuplicates(user: User): Promise<boolean> {
    // This would typically check against your backend API
    // For now, we'll return false as a placeholder
    return false;
  }

  /**
   * Handle registration errors
   */
  private handleRegistrationError(error: any): string {
    if (error.status === 422) {
      return error.error?.join(', ') || 'Validation failed';
    } else if (error.status === 409) {
      return 'User already exists';
    } else if (error.status === 500) {
      return 'Server error occurred';
    } else {
      return 'Registration failed. Please try again.';
    }
  }

  /**
   * Update analytics after registration attempt
   */
  private updateAnalytics(result: RegistrationResult): void {
    const currentAnalytics = this.analytics$.value;
    const updated = { ...currentAnalytics };

    updated.totalRegistrations++;
    updated.todayRegistrations++;

    if (!result.success) {
      const totalAttempts = updated.totalRegistrations;
      const failures = Math.round(totalAttempts * updated.failureRate) + 1;
      updated.failureRate = failures / totalAttempts;

      if (result.error && !updated.topErrorReasons.includes(result.error)) {
        updated.topErrorReasons.push(result.error);
      }
    }

    this.analytics$.next(updated);
  }

  /**
   * Initialize analytics data
   */
  private initializeAnalytics(): void {
    // Load analytics from storage or API
    const stored = localStorage.getItem('registration-analytics');
    if (stored) {
      try {
        const analytics = JSON.parse(stored);
        this.analytics$.next(analytics);
      } catch (error) {
        console.warn('Could not load stored analytics:', error);
      }
    }
  }

  /**
   * Get current analytics
   */
  getAnalytics(): Observable<RegistrationAnalytics> {
    return this.analytics$.asObservable();
  }

  /**
   * Get queued users count
   */
     getQueuedUsersCount(): Observable<number> {
     return this.registrationQueue$.pipe(
       map((queue: User[]) => queue.length)
     );
   }

  /**
   * Send welcome email after successful registration
   */
  private sendWelcomeEmail(user: User): Observable<any> {
    return this.http.post(`${environment.apiBaseUrl}/auth/send-welcome-email`, {
      email: user.email,
      firstname: user.firstname
    });
  }

  /**
   * Verify email address
   */
  verifyEmail(token: string): Observable<any> {
    return this.http.post(`${environment.apiBaseUrl}/auth/verify-email`, { token });
  }

  /**
   * Resend verification email
   */
  resendVerificationEmail(email: string): Observable<any> {
    return this.http.post(`${environment.apiBaseUrl}/auth/resend-verification`, { email });
  }

  /**
   * Export registration data for analytics
   */
  exportRegistrationData(): Observable<any> {
    return this.http.get(`${environment.apiBaseUrl}/admin/registration-export`);
  }

  /**
   * Get registration statistics
   */
  getRegistrationStats(period: 'day' | 'week' | 'month' | 'year'): Observable<any> {
    return this.http.get(`${environment.apiBaseUrl}/admin/registration-stats?period=${period}`);
  }
}