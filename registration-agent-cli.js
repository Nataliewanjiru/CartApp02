#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

/**
 * User Registration Agent CLI Tool
 * 
 * This tool allows bulk user registration via command line interface.
 * It can process CSV files, JSON files, or individual user data.
 * 
 * Usage:
 *   node registration-agent-cli.js --csv users.csv
 *   node registration-agent-cli.js --json users.json
 *   node registration-agent-cli.js --user "John,Doe,john@example.com,password123"
 */

class RegistrationAgentCLI {
  constructor() {
    this.apiBaseUrl = process.env.API_BASE_URL || 'https://portfolio-website-fm1j.onrender.com';
    this.args = this.parseArguments();
    this.statistics = {
      total: 0,
      successful: 0,
      failed: 0,
      errors: []
    };
  }

  parseArguments() {
    const args = process.argv.slice(2);
    const parsed = {};
    
    for (let i = 0; i < args.length; i++) {
      if (args[i].startsWith('--')) {
        const key = args[i].replace('--', '');
        if (key === 'help') {
          parsed[key] = true;
        } else if (i + 1 < args.length && !args[i + 1].startsWith('--')) {
          parsed[key] = args[i + 1];
          i++; // Skip the next argument as it's a value
        } else {
          parsed[key] = true;
        }
      }
    }
    
    return parsed;
  }

  async run() {
    console.log('🚀 User Registration Agent CLI Started');
    console.log(`📡 API Base URL: ${this.apiBaseUrl}`);
    console.log('');

    try {
      if (this.args.csv) {
        await this.processCsvFile(this.args.csv);
      } else if (this.args.json) {
        await this.processJsonFile(this.args.json);
      } else if (this.args.user) {
        await this.processSingleUser(this.args.user);
      } else if (this.args.help || Object.keys(this.args).length === 0) {
        this.showHelp();
        return;
      } else {
        console.error('❌ Invalid arguments. Use --help for usage information.');
        return;
      }

      this.showStatistics();
    } catch (error) {
      console.error('❌ Fatal error:', error.message);
      process.exit(1);
    }
  }

  async processCsvFile(filePath) {
    console.log(`📄 Processing CSV file: ${filePath}`);
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const csvData = fs.readFileSync(filePath, 'utf8');
    const users = this.parseCsvData(csvData);
    
    console.log(`👥 Found ${users.length} users to register`);
    await this.registerUsers(users);
  }

  async processJsonFile(filePath) {
    console.log(`📄 Processing JSON file: ${filePath}`);
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const jsonData = fs.readFileSync(filePath, 'utf8');
    const users = JSON.parse(jsonData);
    
    if (!Array.isArray(users)) {
      throw new Error('JSON file must contain an array of user objects');
    }
    
    console.log(`👥 Found ${users.length} users to register`);
    await this.registerUsers(users);
  }

  async processSingleUser(userData) {
    console.log(`👤 Processing single user: ${userData}`);
    
    const userParts = userData.split(',');
    if (userParts.length < 4) {
      throw new Error('User data must contain at least: firstname,lastname,email,password');
    }

    const user = {
      firstname: userParts[0].trim(),
      lastname: userParts[1].trim(),
      email: userParts[2].trim(),
      password: userParts[3].trim(),
      username: userParts[4]?.trim() || '',
      userpicture: '',
      groups: []
    };

    await this.registerUsers([user]);
  }

  parseCsvData(csvData) {
    const lines = csvData.split('\n');
    const users = [];
    
    // Skip header row if it looks like headers
    const startIndex = lines[0] && lines[0].toLowerCase().includes('firstname') ? 1 : 0;
    
    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const columns = line.split(',');
      if (columns.length >= 4) {
        const user = {
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
        } else {
          console.warn(`⚠️  Skipping invalid user at line ${i + 1}: missing required fields`);
        }
      }
    }
    
    return users;
  }

  async registerUsers(users) {
    console.log('\n🔄 Starting registration process...\n');
    
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      this.statistics.total++;
      
      try {
        console.log(`📝 Registering user ${i + 1}/${users.length}: ${user.firstname} ${user.lastname} (${user.email})`);
        
        const result = await this.registerUser(user);
        
        if (result.success) {
          this.statistics.successful++;
          console.log(`   ✅ Success`);
        } else {
          this.statistics.failed++;
          this.statistics.errors.push(`${user.email}: ${result.error}`);
          console.log(`   ❌ Failed: ${result.error}`);
        }
      } catch (error) {
        this.statistics.failed++;
        this.statistics.errors.push(`${user.email}: ${error.message}`);
        console.log(`   ❌ Error: ${error.message}`);
      }
      
      // Add small delay to avoid overwhelming the server
      await this.delay(100);
    }
  }

  async registerUser(user) {
    return new Promise((resolve, reject) => {
      const postData = JSON.stringify(user);
      const url = new URL(`${this.apiBaseUrl}/auth/register`);
      
      const options = {
        hostname: url.hostname,
        port: url.port || (url.protocol === 'https:' ? 443 : 80),
        path: url.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const protocol = url.protocol === 'https:' ? https : http;
      
      const req = protocol.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            if (res.statusCode === 200 || res.statusCode === 201) {
              resolve({ success: true });
            } else {
              const errorData = JSON.parse(data);
              resolve({ 
                success: false, 
                error: errorData.message || `HTTP ${res.statusCode}` 
              });
            }
          } catch (error) {
            resolve({ 
              success: false, 
              error: `Invalid response: ${res.statusCode}` 
            });
          }
        });
      });
      
      req.on('error', (error) => {
        reject(error);
      });
      
      req.write(postData);
      req.end();
    });
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  showStatistics() {
    console.log('\n📊 Registration Statistics:');
    console.log('═'.repeat(50));
    console.log(`Total Users Processed: ${this.statistics.total}`);
    console.log(`✅ Successful: ${this.statistics.successful}`);
    console.log(`❌ Failed: ${this.statistics.failed}`);
    
    if (this.statistics.total > 0) {
      const successRate = ((this.statistics.successful / this.statistics.total) * 100).toFixed(1);
      console.log(`📈 Success Rate: ${successRate}%`);
    }
    
    if (this.statistics.errors.length > 0) {
      console.log('\n❌ Error Details:');
      console.log('-'.repeat(30));
      this.statistics.errors.forEach(error => {
        console.log(`   ${error}`);
      });
    }
    
    console.log('\n🎉 Registration Agent CLI completed!');
  }

  showHelp() {
    console.log(`
🚀 User Registration Agent CLI Tool

USAGE:
  node registration-agent-cli.js [OPTIONS]

OPTIONS:
  --csv <file>      Process users from a CSV file
                    Format: firstname,lastname,email,password,username
                    
  --json <file>     Process users from a JSON file
                    Format: Array of user objects
                    
  --user <data>     Register a single user
                    Format: "firstname,lastname,email,password,username"
                    
  --help           Show this help message

EXAMPLES:
  # Register users from CSV file
  node registration-agent-cli.js --csv users.csv
  
  # Register users from JSON file
  node registration-agent-cli.js --json users.json
  
  # Register a single user
  node registration-agent-cli.js --user "John,Doe,john@example.com,password123,johndoe"

ENVIRONMENT VARIABLES:
  API_BASE_URL     Set the API base URL (default: https://portfolio-website-fm1j.onrender.com)

CSV FILE FORMAT:
  firstname,lastname,email,password,username
  John,Doe,john@example.com,password123,johndoe
  Jane,Smith,jane@example.com,password456,janesmith

JSON FILE FORMAT:
  [
    {
      "firstname": "John",
      "lastname": "Doe",
      "email": "john@example.com",
      "password": "password123",
      "username": "johndoe"
    }
  ]
`);
  }
}

// Run the CLI if this file is executed directly
if (require.main === module) {
  const cli = new RegistrationAgentCLI();
  cli.run().catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  });
}

module.exports = RegistrationAgentCLI;