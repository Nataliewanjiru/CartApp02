# 🚀 User Registration Agent

A comprehensive user registration system built on Angular with advanced features for managing user registrations, bulk operations, analytics, and administrative controls.

## 📋 Table of Contents

- [Features](#features)
- [System Architecture](#system-architecture)
- [Getting Started](#getting-started)
- [Components Overview](#components-overview)
- [CLI Tool](#cli-tool)
- [API Integration](#api-integration)
- [Usage Examples](#usage-examples)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)

## ✨ Features

### Core Registration Features
- ✅ **Advanced User Registration** - Enhanced registration with comprehensive validation
- ✅ **Bulk User Import** - CSV and JSON file import capabilities
- ✅ **Registration Queue** - Queue users for batch processing
- ✅ **Real-time Analytics** - Track registration statistics and performance
- ✅ **Error Handling** - Detailed error reporting and validation
- ✅ **Email Verification** - Optional email verification workflow
- ✅ **Password Validation** - Configurable password requirements
- ✅ **Duplicate Detection** - Prevent duplicate user registrations

### Administrative Features
- 📊 **Registration Dashboard** - Comprehensive admin interface
- 📈 **Analytics & Reporting** - Registration trends and success rates
- 🔄 **Batch Processing** - Process queued users efficiently
- 📁 **Data Export** - Export registration data for analysis
- ⚙️ **Configurable Settings** - Customizable registration rules
- 🎯 **Success Tracking** - Monitor registration success rates

### Developer Tools
- 🖥️ **CLI Tool** - Command-line interface for bulk operations
- 🔧 **TypeScript Support** - Full type safety and IntelliSense
- 📚 **Comprehensive Documentation** - Detailed usage guides
- 🧪 **Sample Data** - Test CSV and JSON files included

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                 User Registration Agent                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────┐  ┌─────────────────────────────┐   │
│  │   Frontend UI   │  │    Registration Dashboard   │   │
│  │  - Sign Up Form │  │  - Analytics Display       │   │
│  │  - Validation   │  │  - Bulk Registration       │   │
│  │  - User Feedback│  │  - Queue Management        │   │
│  └─────────────────┘  └─────────────────────────────┘   │
│           │                         │                   │
│  ┌─────────────────────────────────────────────────────┐ │
│  │         User Registration Agent Service             │ │
│  │  - Registration Logic    - Analytics Tracking      │ │
│  │  - Validation Engine     - Queue Management        │ │
│  │  - Error Handling        - Configuration           │ │
│  └─────────────────────────────────────────────────────┘ │
│           │                                             │
│  ┌─────────────────┐  ┌─────────────────────────────┐   │
│  │   User Service  │  │         CLI Tool            │   │
│  │  - HTTP Client  │  │  - Bulk CSV/JSON Import     │   │
│  │  - API Calls    │  │  - Command Line Interface   │   │
│  │  - Token Mgmt   │  │  - Statistics Reporting     │   │
│  └─────────────────┘  └─────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- Angular CLI 19+
- Access to the backend API

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   Update `src/environments/environment.ts`:
   ```typescript
   export const environment = {
     production: false,
     apiBaseUrl: 'https://your-api-base-url.com'
   };
   ```

3. **Start Development Server**
   ```bash
   npm start
   ```

4. **Access the Application**
   - Main App: http://localhost:4200
   - Registration Dashboard: http://localhost:4200/admin/registration-dashboard

## 🧩 Components Overview

### 1. UserRegistrationAgentService

The core service that handles all registration logic:

```typescript
// Basic usage
import { UserRegistrationAgentService } from './service/user-registration-agent.service';

constructor(private registrationAgent: UserRegistrationAgentService) {}

// Register a single user
this.registrationAgent.registerUser(user).subscribe(result => {
  if (result.success) {
    console.log('User registered successfully!');
  } else {
    console.log('Registration failed:', result.error);
  }
});

// Bulk registration
this.registrationAgent.registerBulkUsers(users).subscribe(result => {
  console.log(`Processed: ${result.totalProcessed}, Success: ${result.successful}`);
});
```

**Key Features:**
- Advanced validation engine
- Bulk registration capabilities
- Analytics tracking
- Error handling and reporting
- Configurable registration rules

### 2. Registration Dashboard Component

Administrative interface for managing registrations:

**Features:**
- Real-time analytics display
- Single user registration form
- Bulk import (CSV/JSON)
- Queue management
- Registration statistics

**Navigation:** `/admin/registration-dashboard`

### 3. Enhanced Sign-Up Component

Improved user registration form with:
- Advanced validation feedback
- Real-time error handling
- Loading states and user feedback
- Integration with registration agent

## 🖥️ CLI Tool

The command-line tool enables bulk user registration from external systems.

### Installation
```bash
chmod +x registration-agent-cli.js
```

### Usage Examples

**Register from CSV file:**
```bash
node registration-agent-cli.js --csv sample-users.csv
```

**Register from JSON file:**
```bash
node registration-agent-cli.js --json sample-users.json
```

**Register single user:**
```bash
node registration-agent-cli.js --user "John,Doe,john@example.com,password123,johndoe"
```

**Get help:**
```bash
node registration-agent-cli.js --help
```

### File Formats

**CSV Format:**
```csv
firstname,lastname,email,password,username
John,Doe,john@example.com,password123,johndoe
Jane,Smith,jane@example.com,password456,janesmith
```

**JSON Format:**
```json
[
  {
    "firstname": "John",
    "lastname": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "username": "johndoe"
  }
]
```

## 🌐 API Integration

### Registration Endpoint
```
POST /auth/register
Content-Type: application/json

{
  "firstname": "John",
  "lastname": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "username": "johndoe"
}
```

### Response Format
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "user-id",
    "email": "john@example.com"
  }
}
```

## 📊 Usage Examples

### 1. Single User Registration

```typescript
// In your component
import { UserRegistrationAgentService } from './service/user-registration-agent.service';

export class MyComponent {
  constructor(private registrationAgent: UserRegistrationAgentService) {}

  registerUser() {
    const user = {
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      password: 'password123',
      username: 'johndoe',
      userpicture: '',
      groups: []
    };

    this.registrationAgent.registerUser(user).subscribe(result => {
      if (result.success) {
        alert('Registration successful!');
      } else {
        alert(`Registration failed: ${result.error}`);
      }
    });
  }
}
```

### 2. Bulk Registration with Custom Configuration

```typescript
// Custom configuration
const config = {
  requireEmailVerification: false,
  passwordMinLength: 6,
  autoGenerateUsername: true,
  sendWelcomeEmail: true
};

// Bulk register with custom config
this.registrationAgent.registerBulkUsers(users, config).subscribe(result => {
  console.log(`
    Total: ${result.totalProcessed}
    Successful: ${result.successful}
    Failed: ${result.failed}
  `);
});
```

### 3. Queue Management

```typescript
// Add users to queue
users.forEach(user => {
  this.registrationAgent.queueUserForRegistration(user);
});

// Process entire queue
this.registrationAgent.processRegistrationQueue().subscribe(result => {
  console.log('Queue processed:', result);
});
```

### 4. Analytics Monitoring

```typescript
// Get real-time analytics
this.registrationAgent.getAnalytics().subscribe(analytics => {
  console.log(`
    Total Registrations: ${analytics.totalRegistrations}
    Today's Registrations: ${analytics.todayRegistrations}
    Success Rate: ${(1 - analytics.failureRate) * 100}%
  `);
});
```

## ⚙️ Configuration

### Registration Configuration Options

```typescript
interface RegistrationConfig {
  requireEmailVerification: boolean;    // Default: true
  passwordMinLength: number;            // Default: 8
  allowSpecialCharacters: boolean;      // Default: true
  requiredFields: string[];             // Default: ['firstname', 'lastname', 'email', 'password']
  autoGenerateUsername: boolean;        // Default: false
  sendWelcomeEmail: boolean;           // Default: true
}
```

### Environment Variables

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiBaseUrl: 'https://your-api-url.com'
};
```

### CLI Environment Variables

```bash
# Set custom API URL for CLI tool
export API_BASE_URL=https://your-custom-api.com
node registration-agent-cli.js --csv users.csv
```

## 🔧 Troubleshooting

### Common Issues

**1. Registration Fails with Validation Errors**
- Check that all required fields are provided
- Verify email format is valid
- Ensure password meets minimum length requirements

**2. CLI Tool Cannot Connect to API**
- Verify the API_BASE_URL environment variable
- Check network connectivity
- Ensure the API endpoint is accessible

**3. Dashboard Not Loading Analytics**
- Check browser console for errors
- Verify the UserRegistrationAgentService is properly injected
- Ensure proper routing configuration

**4. Bulk Registration Fails**
- Validate CSV/JSON file format
- Check for duplicate email addresses
- Verify all required fields are present

### Debug Mode

Enable detailed logging:

```typescript
// In your service
constructor() {
  console.log('Registration Agent initialized');
  // Add breakpoints for debugging
}
```

### Performance Optimization

For large bulk registrations:
- Use the queue system for processing
- Implement pagination for large datasets
- Add delays between API calls to avoid rate limiting

## 📈 Monitoring and Analytics

### Key Metrics Tracked
- Total registrations
- Daily/weekly/monthly registration counts
- Success and failure rates
- Top error reasons
- Queue processing performance

### Exporting Data
```typescript
// Export registration data
this.registrationAgent.exportRegistrationData().subscribe(data => {
  // Process exported data
  console.log('Exported data:', data);
});
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the troubleshooting section
- Review the documentation
- Create an issue in the repository

---

**Built with ❤️ using Angular, TypeScript, and Bootstrap**