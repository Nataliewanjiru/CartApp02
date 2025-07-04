const axios = require('axios');

/**
 * Test script for Twilio Registration Bot
 * 
 * This script simulates various conversation flows to test the bot functionality.
 * Run with: node test-bot.js
 */

const BOT_URL = process.env.BOT_URL || 'http://localhost:3000';
const TEST_PHONE = '+1234567890';

class BotTester {
  constructor() {
    this.testResults = [];
  }

  async sendMessage(message, description) {
    try {
      console.log(`\n🧪 Testing: ${description}`);
      console.log(`📤 Sending: "${message}"`);
      
      const response = await axios.post(`${BOT_URL}/webhook`, 
        `From=${TEST_PHONE}&Body=${encodeURIComponent(message)}`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      const responseText = this.extractMessageFromTwiML(response.data);
      console.log(`📥 Response: "${responseText}"`);
      
      this.testResults.push({
        test: description,
        input: message,
        output: responseText,
        success: response.status === 200
      });

      // Add delay between messages
      await this.delay(500);
      
      return responseText;
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
      this.testResults.push({
        test: description,
        input: message,
        output: error.message,
        success: false
      });
      return null;
    }
  }

  extractMessageFromTwiML(twiml) {
    // Extract message from TwiML response
    const messageMatch = twiml.match(/<Message[^>]*>(.*?)<\/Message>/s);
    return messageMatch ? messageMatch[1].trim() : 'No message found';
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async testCompleteRegistrationFlow() {
    console.log('\n🚀 Testing Complete Registration Flow');
    console.log('=' .repeat(50));

    await this.sendMessage('register', 'Starting registration');
    await this.sendMessage('John', 'Providing first name');
    await this.sendMessage('Doe', 'Providing last name');
    await this.sendMessage('john.test@example.com', 'Providing email');
    await this.sendMessage('johntester', 'Providing username');
    await this.sendMessage('testpass123', 'Providing password');
    await this.sendMessage('yes', 'Confirming registration');
  }

  async testCommands() {
    console.log('\n🤖 Testing Bot Commands');
    console.log('=' .repeat(50));

    await this.sendMessage('help', 'Help command');
    await this.sendMessage('register', 'Register command');
    await this.sendMessage('cancel', 'Cancel command');
    await this.sendMessage('status', 'Status command');
    await this.sendMessage('unknown', 'Unknown command');
  }

  async testValidation() {
    console.log('\n✅ Testing Input Validation');
    console.log('=' .repeat(50));

    await this.sendMessage('register', 'Starting new registration');
    await this.sendMessage('J', 'Invalid first name (too short)');
    await this.sendMessage('John123', 'Invalid first name (numbers)');
    await this.sendMessage('John', 'Valid first name');
    await this.sendMessage('cancel', 'Canceling to reset');
  }

  async testSessionManagement() {
    console.log('\n📊 Testing Session Management');
    console.log('=' .repeat(50));

    await this.sendMessage('register', 'Starting registration');
    await this.sendMessage('Jane', 'First name');
    await this.sendMessage('status', 'Checking status mid-registration');
    await this.sendMessage('Smith', 'Continuing with last name');
    await this.sendMessage('cancel', 'Canceling registration');
  }

  async testHealthEndpoints() {
    console.log('\n🏥 Testing Health Endpoints');
    console.log('=' .repeat(50));

    try {
      const healthResponse = await axios.get(`${BOT_URL}/health`);
      console.log(`✅ Health check: ${JSON.stringify(healthResponse.data, null, 2)}`);
      
      const dashboardResponse = await axios.get(`${BOT_URL}/dashboard`);
      console.log(`✅ Dashboard: ${JSON.stringify(dashboardResponse.data, null, 2)}`);
    } catch (error) {
      console.error(`❌ Health endpoint error: ${error.message}`);
    }
  }

  async runAllTests() {
    console.log('🤖 Starting Twilio Registration Bot Tests');
    console.log(`🔗 Bot URL: ${BOT_URL}`);
    console.log(`📱 Test Phone: ${TEST_PHONE}`);

    try {
      await this.testHealthEndpoints();
      await this.testCommands();
      await this.testValidation();
      await this.testSessionManagement();
      await this.testCompleteRegistrationFlow();
      
      this.showTestSummary();
    } catch (error) {
      console.error('Test execution failed:', error);
    }
  }

  showTestSummary() {
    console.log('\n📊 Test Summary');
    console.log('=' .repeat(50));
    
    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(test => test.success).length;
    const failedTests = totalTests - passedTests;
    
    console.log(`Total Tests: ${totalTests}`);
    console.log(`✅ Passed: ${passedTests}`);
    console.log(`❌ Failed: ${failedTests}`);
    console.log(`📈 Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
    
    if (failedTests > 0) {
      console.log('\n❌ Failed Tests:');
      this.testResults
        .filter(test => !test.success)
        .forEach(test => {
          console.log(`  - ${test.test}: ${test.output}`);
        });
    }
    
    console.log('\n🎉 Testing completed!');
  }
}

// Manual test functions for interactive testing
async function testSingleMessage(message) {
  const tester = new BotTester();
  await tester.sendMessage(message, 'Manual test');
}

async function simulateUserConversation() {
  console.log('🎭 Simulating realistic user conversation...');
  
  const tester = new BotTester();
  
  // Simulate a user who makes some mistakes
  await tester.sendMessage('hi', 'User greeting');
  await tester.sendMessage('help', 'User asks for help');
  await tester.sendMessage('register', 'User starts registration');
  await tester.sendMessage('test', 'User provides name');
  await tester.sendMessage('user', 'User provides last name');
  await tester.sendMessage('invalid-email', 'User provides invalid email');
  await tester.sendMessage('test@example.com', 'User corrects email');
  await tester.sendMessage('testuser', 'User provides username');
  await tester.sendMessage('123', 'User provides weak password');
  await tester.sendMessage('testpass123', 'User provides valid password');
  await tester.sendMessage('no', 'User wants to restart');
  await tester.sendMessage('cancel', 'User cancels registration');
}

// Command line interface
const command = process.argv[2];

async function main() {
  const tester = new BotTester();
  
  switch (command) {
    case 'all':
      await tester.runAllTests();
      break;
      
    case 'conversation':
      await simulateUserConversation();
      break;
      
    case 'health':
      await tester.testHealthEndpoints();
      break;
      
    case 'commands':
      await tester.testCommands();
      break;
      
    case 'message':
      const message = process.argv[3];
      if (message) {
        await testSingleMessage(message);
      } else {
        console.log('Usage: node test-bot.js message "your message here"');
      }
      break;
      
    default:
      console.log(`
🤖 Twilio Registration Bot Tester

Usage:
  node test-bot.js all              # Run all tests
  node test-bot.js conversation     # Simulate user conversation
  node test-bot.js health           # Test health endpoints
  node test-bot.js commands         # Test bot commands
  node test-bot.js message "hi"     # Send single message

Environment:
  BOT_URL=${BOT_URL}
  
Examples:
  node test-bot.js all
  node test-bot.js message "register"
  BOT_URL=https://your-bot.herokuapp.com node test-bot.js all
      `);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { BotTester, testSingleMessage, simulateUserConversation };