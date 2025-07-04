const express = require('express');
const twilio = require('twilio');
const axios = require('axios');
require('dotenv').config();

/**
 * Twilio User Registration Bot
 * 
 * This bot handles user registration through SMS/WhatsApp conversations.
 * Users can text the bot to start registration and provide their details step by step.
 * 
 * Environment Variables Required:
 * - TWILIO_ACCOUNT_SID
 * - TWILIO_AUTH_TOKEN
 * - API_BASE_URL (your registration API)
 * - PORT (optional, defaults to 3000)
 */

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Twilio client
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// API configuration
const API_BASE_URL = process.env.API_BASE_URL || 'https://portfolio-website-fm1j.onrender.com';

// In-memory session storage (use Redis in production)
const userSessions = new Map();

// Registration flow states
const STATES = {
  WELCOME: 'welcome',
  COLLECTING_FIRST_NAME: 'collecting_first_name',
  COLLECTING_LAST_NAME: 'collecting_last_name',
  COLLECTING_EMAIL: 'collecting_email',
  COLLECTING_USERNAME: 'collecting_username',
  COLLECTING_PASSWORD: 'collecting_password',
  CONFIRMING_DETAILS: 'confirming_details',
  COMPLETED: 'completed'
};

// Bot responses
const MESSAGES = {
  WELCOME: `👋 Welcome to the User Registration Bot!

I'll help you create a new account. This will take just a few minutes.

Type 'register' to start or 'help' for assistance.`,

  HELP: `🤖 Registration Bot Commands:

• 'register' - Start new registration
• 'cancel' - Cancel current registration  
• 'status' - Check registration status
• 'help' - Show this help

During registration, simply answer my questions step by step!`,

  START_REGISTRATION: `🚀 Let's get you registered!

I'll need some basic information from you. You can type 'cancel' at any time to stop.

What's your first name?`,

  COLLECT_LAST_NAME: `Great! Now what's your last name?`,

  COLLECT_EMAIL: `Perfect! What's your email address?

(This will be used for login and important notifications)`,

  COLLECT_USERNAME: `Excellent! Now choose a username.

(This should be unique and at least 3 characters)`,

  COLLECT_PASSWORD: `Almost done! Create a secure password.

(At least 8 characters, include letters and numbers)`,

  CONFIRM_DETAILS: (details) => `📋 Please confirm your details:

👤 Name: ${details.firstName} ${details.lastName}
📧 Email: ${details.email}
🆔 Username: ${details.username}

Reply 'yes' to confirm or 'no' to restart.`,

  SUCCESS: (name) => `🎉 Congratulations ${name}!

Your account has been created successfully! You can now log in to the platform using your email and password.

Thank you for registering! 🎊`,

  REGISTRATION_ERROR: (error) => `❌ Registration failed: ${error}

Type 'register' to try again or 'help' for assistance.`,

  VALIDATION_ERROR: (field, message) => `⚠️ Invalid ${field}: ${message}

Please try again:`,

  CANCELLED: `❌ Registration cancelled.

Type 'register' to start over or 'help' for assistance.`,

  UNKNOWN_COMMAND: `🤔 I didn't understand that.

Type 'help' to see available commands or 'register' to start registration.`
};

class RegistrationBot {
  constructor() {
    this.sessions = userSessions;
  }

  // Get or create user session
  getSession(phoneNumber) {
    if (!this.sessions.has(phoneNumber)) {
      this.sessions.set(phoneNumber, {
        state: STATES.WELCOME,
        userData: {},
        attempts: 0,
        lastActivity: new Date()
      });
    }
    return this.sessions.get(phoneNumber);
  }

  // Update session state
  updateSession(phoneNumber, updates) {
    const session = this.getSession(phoneNumber);
    Object.assign(session, updates, { lastActivity: new Date() });
    this.sessions.set(phoneNumber, session);
  }

  // Clear session
  clearSession(phoneNumber) {
    this.sessions.delete(phoneNumber);
  }

  // Handle incoming message
  async handleMessage(phoneNumber, message, res) {
    const session = this.getSession(phoneNumber);
    const lowerMessage = message.toLowerCase().trim();

    // Handle global commands
    if (lowerMessage === 'cancel') {
      this.clearSession(phoneNumber);
      return this.sendResponse(res, MESSAGES.CANCELLED);
    }

    if (lowerMessage === 'help') {
      return this.sendResponse(res, MESSAGES.HELP);
    }

    if (lowerMessage === 'status') {
      return this.sendResponse(res, this.getStatusMessage(session));
    }

    // Handle state-specific logic
    switch (session.state) {
      case STATES.WELCOME:
        return this.handleWelcome(phoneNumber, lowerMessage, res);

      case STATES.COLLECTING_FIRST_NAME:
        return this.handleFirstName(phoneNumber, message, res);

      case STATES.COLLECTING_LAST_NAME:
        return this.handleLastName(phoneNumber, message, res);

      case STATES.COLLECTING_EMAIL:
        return this.handleEmail(phoneNumber, message, res);

      case STATES.COLLECTING_USERNAME:
        return this.handleUsername(phoneNumber, message, res);

      case STATES.COLLECTING_PASSWORD:
        return this.handlePassword(phoneNumber, message, res);

      case STATES.CONFIRMING_DETAILS:
        return this.handleConfirmation(phoneNumber, lowerMessage, res);

      default:
        return this.sendResponse(res, MESSAGES.UNKNOWN_COMMAND);
    }
  }

  // Handle welcome state
  handleWelcome(phoneNumber, message, res) {
    if (message === 'register') {
      this.updateSession(phoneNumber, { 
        state: STATES.COLLECTING_FIRST_NAME,
        userData: {}
      });
      return this.sendResponse(res, MESSAGES.START_REGISTRATION);
    }
    return this.sendResponse(res, MESSAGES.WELCOME);
  }

  // Handle first name collection
  handleFirstName(phoneNumber, message, res) {
    const firstName = message.trim();
    
    if (!this.validateName(firstName)) {
      return this.sendResponse(res, 
        MESSAGES.VALIDATION_ERROR('first name', 'Please enter a valid name (2-50 characters, letters only)')
      );
    }

    this.updateSession(phoneNumber, {
      state: STATES.COLLECTING_LAST_NAME,
      userData: { firstName }
    });
    
    return this.sendResponse(res, MESSAGES.COLLECT_LAST_NAME);
  }

  // Handle last name collection
  handleLastName(phoneNumber, message, res) {
    const lastName = message.trim();
    
    if (!this.validateName(lastName)) {
      return this.sendResponse(res, 
        MESSAGES.VALIDATION_ERROR('last name', 'Please enter a valid name (2-50 characters, letters only)')
      );
    }

    const session = this.getSession(phoneNumber);
    session.userData.lastName = lastName;
    this.updateSession(phoneNumber, {
      state: STATES.COLLECTING_EMAIL,
      userData: session.userData
    });
    
    return this.sendResponse(res, MESSAGES.COLLECT_EMAIL);
  }

  // Handle email collection
  handleEmail(phoneNumber, message, res) {
    const email = message.trim().toLowerCase();
    
    if (!this.validateEmail(email)) {
      return this.sendResponse(res, 
        MESSAGES.VALIDATION_ERROR('email', 'Please enter a valid email address')
      );
    }

    const session = this.getSession(phoneNumber);
    session.userData.email = email;
    this.updateSession(phoneNumber, {
      state: STATES.COLLECTING_USERNAME,
      userData: session.userData
    });
    
    return this.sendResponse(res, MESSAGES.COLLECT_USERNAME);
  }

  // Handle username collection
  handleUsername(phoneNumber, message, res) {
    const username = message.trim().toLowerCase();
    
    if (!this.validateUsername(username)) {
      return this.sendResponse(res, 
        MESSAGES.VALIDATION_ERROR('username', 'Username must be 3-20 characters, letters and numbers only')
      );
    }

    const session = this.getSession(phoneNumber);
    session.userData.username = username;
    this.updateSession(phoneNumber, {
      state: STATES.COLLECTING_PASSWORD,
      userData: session.userData
    });
    
    return this.sendResponse(res, MESSAGES.COLLECT_PASSWORD);
  }

  // Handle password collection
  handlePassword(phoneNumber, message, res) {
    const password = message.trim();
    
    if (!this.validatePassword(password)) {
      return this.sendResponse(res, 
        MESSAGES.VALIDATION_ERROR('password', 'Password must be at least 8 characters with letters and numbers')
      );
    }

    const session = this.getSession(phoneNumber);
    session.userData.password = password;
    this.updateSession(phoneNumber, {
      state: STATES.CONFIRMING_DETAILS,
      userData: session.userData
    });
    
    return this.sendResponse(res, MESSAGES.CONFIRM_DETAILS(session.userData));
  }

  // Handle confirmation
  async handleConfirmation(phoneNumber, message, res) {
    if (message === 'yes') {
      const session = this.getSession(phoneNumber);
      try {
        await this.registerUser(session.userData);
        this.clearSession(phoneNumber);
        return this.sendResponse(res, MESSAGES.SUCCESS(session.userData.firstName));
      } catch (error) {
        return this.sendResponse(res, MESSAGES.REGISTRATION_ERROR(error.message));
      }
    } else if (message === 'no') {
      this.updateSession(phoneNumber, { 
        state: STATES.COLLECTING_FIRST_NAME,
        userData: {}
      });
      return this.sendResponse(res, MESSAGES.START_REGISTRATION);
    } else {
      return this.sendResponse(res, 'Please reply "yes" to confirm or "no" to restart.');
    }
  }

  // Validation methods
  validateName(name) {
    return /^[a-zA-Z\s]{2,50}$/.test(name);
  }

  validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  validateUsername(username) {
    return /^[a-zA-Z0-9]{3,20}$/.test(username);
  }

  validatePassword(password) {
    return password.length >= 8 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password);
  }

  // Register user with API
  async registerUser(userData) {
    const registrationData = {
      firstname: userData.firstName,
      lastname: userData.lastName,
      email: userData.email,
      username: userData.username,
      password: userData.password,
      userpicture: '',
      groups: []
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, registrationData, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      if (response.status === 200 || response.status === 201) {
        return response.data;
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      if (error.response) {
        // API returned an error
        const errorMessage = error.response.data?.message || 
                           (Array.isArray(error.response.data) ? error.response.data.join(', ') : 'Registration failed');
        throw new Error(errorMessage);
      } else if (error.request) {
        // Network error
        throw new Error('Unable to connect to registration service');
      } else {
        // Other error
        throw new Error(error.message || 'Registration failed');
      }
    }
  }

  // Get status message
  getStatusMessage(session) {
    const stateMessages = {
      [STATES.WELCOME]: 'Ready to start registration',
      [STATES.COLLECTING_FIRST_NAME]: 'Collecting first name',
      [STATES.COLLECTING_LAST_NAME]: 'Collecting last name', 
      [STATES.COLLECTING_EMAIL]: 'Collecting email address',
      [STATES.COLLECTING_USERNAME]: 'Collecting username',
      [STATES.COLLECTING_PASSWORD]: 'Collecting password',
      [STATES.CONFIRMING_DETAILS]: 'Waiting for confirmation',
      [STATES.COMPLETED]: 'Registration completed'
    };

    return `📊 Registration Status: ${stateMessages[session.state] || 'Unknown'}

${session.userData.firstName ? `Name: ${session.userData.firstName} ${session.userData.lastName || ''}` : ''}
${session.userData.email ? `Email: ${session.userData.email}` : ''}
${session.userData.username ? `Username: ${session.userData.username}` : ''}

Type 'cancel' to restart or continue where you left off.`;
  }

  // Send Twilio response
  sendResponse(res, message) {
    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message(message);
    res.type('text/xml');
    res.send(twiml.toString());
  }
}

// Initialize bot
const bot = new RegistrationBot();

// Clean up old sessions (run every 30 minutes)
setInterval(() => {
  const cutoff = new Date(Date.now() - 30 * 60 * 1000); // 30 minutes ago
  for (const [phoneNumber, session] of userSessions.entries()) {
    if (session.lastActivity < cutoff) {
      userSessions.delete(phoneNumber);
      console.log(`Cleaned up session for ${phoneNumber}`);
    }
  }
}, 30 * 60 * 1000);

// Webhook endpoint for Twilio
app.post('/webhook', (req, res) => {
  const { From: phoneNumber, Body: message } = req.body;
  
  console.log(`Message from ${phoneNumber}: ${message}`);
  
  bot.handleMessage(phoneNumber, message, res).catch(error => {
    console.error('Error handling message:', error);
    bot.sendResponse(res, 'Sorry, something went wrong. Please try again later.');
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    activeSessions: userSessions.size,
    uptime: process.uptime()
  });
});

// Dashboard endpoint
app.get('/dashboard', (req, res) => {
  const sessions = Array.from(userSessions.entries()).map(([phone, session]) => ({
    phone: phone.replace(/\d(?=\d{4})/g, '*'), // Mask phone number
    state: session.state,
    progress: session.userData,
    lastActivity: session.lastActivity
  }));

  res.json({
    activeSessions: userSessions.size,
    sessions: sessions,
    uptime: process.uptime(),
    environment: {
      nodeEnv: process.env.NODE_ENV,
      apiBaseUrl: API_BASE_URL,
      twilioConfigured: !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN)
    }
  });
});

// Start server
app.listen(port, () => {
  console.log(`🤖 Twilio Registration Bot running on port ${port}`);
  console.log(`📡 API Base URL: ${API_BASE_URL}`);
  console.log(`🔗 Webhook URL: http://localhost:${port}/webhook`);
  console.log(`📊 Dashboard: http://localhost:${port}/dashboard`);
  
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    console.warn('⚠️  Twilio credentials not configured. Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN environment variables.');
  }
});

module.exports = app;