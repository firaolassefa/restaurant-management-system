// Encryption Service
// Handles data encryption, decryption, and security utilities

import CryptoJS from 'crypto-js';

class EncryptionService {
  constructor() {
    // In a real application, this should be stored securely and not in the frontend
    this.secretKey = process.env.REACT_APP_ENCRYPTION_KEY || 'rms-default-key-2024';
    this.algorithm = 'AES';
  }

  // Encrypt sensitive data
  encrypt(data) {
    try {
      if (typeof data !== 'string') {
        data = JSON.stringify(data);
      }
      
      const encrypted = CryptoJS.AES.encrypt(data, this.secretKey).toString();
      return encrypted;
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  // Decrypt sensitive data
  decrypt(encryptedData) {
    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedData, this.secretKey);
      const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
      
      if (!decryptedString) {
        throw new Error('Failed to decrypt data');
      }
      
      // Try to parse as JSON, return as string if parsing fails
      try {
        return JSON.parse(decryptedString);
      } catch {
        return decryptedString;
      }
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  // Hash password or sensitive data
  hash(data, salt = '') {
    try {
      const saltedData = data + salt;
      return CryptoJS.SHA256(saltedData).toString();
    } catch (error) {
      console.error('Hashing error:', error);
      throw new Error('Failed to hash data');
    }
  }

  // Generate random salt
  generateSalt(length = 16) {
    return CryptoJS.lib.WordArray.random(length).toString();
  }

  // Generate secure random token
  generateToken(length = 32) {
    return CryptoJS.lib.WordArray.random(length).toString();
  }

  // Encrypt local storage data
  encryptLocalStorage(key, data) {
    try {
      const encryptedData = this.encrypt(data);
      localStorage.setItem(key, encryptedData);
      return true;
    } catch (error) {
      console.error('Local storage encryption error:', error);
      return false;
    }
  }

  // Decrypt local storage data
  decryptLocalStorage(key) {
    try {
      const encryptedData = localStorage.getItem(key);
      if (!encryptedData) {
        return null;
      }
      return this.decrypt(encryptedData);
    } catch (error) {
      console.error('Local storage decryption error:', error);
      return null;
    }
  }

  // Encrypt session storage data
  encryptSessionStorage(key, data) {
    try {
      const encryptedData = this.encrypt(data);
      sessionStorage.setItem(key, encryptedData);
      return true;
    } catch (error) {
      console.error('Session storage encryption error:', error);
      return false;
    }
  }

  // Decrypt session storage data
  decryptSessionStorage(key) {
    try {
      const encryptedData = sessionStorage.getItem(key);
      if (!encryptedData) {
        return null;
      }
      return this.decrypt(encryptedData);
    } catch (error) {
      console.error('Session storage decryption error:', error);
      return null;
    }
  }

  // Validate data integrity
  validateIntegrity(data, hash) {
    try {
      const computedHash = this.hash(data);
      return computedHash === hash;
    } catch (error) {
      console.error('Integrity validation error:', error);
      return false;
    }
  }

  // Secure data transmission preparation
  prepareForTransmission(data) {
    try {
      const timestamp = Date.now();
      const nonce = this.generateToken(16);
      
      const payload = {
        data: data,
        timestamp: timestamp,
        nonce: nonce
      };
      
      const encrypted = this.encrypt(payload);
      const integrity = this.hash(encrypted);
      
      return {
        payload: encrypted,
        integrity: integrity,
        timestamp: timestamp
      };
    } catch (error) {
      console.error('Transmission preparation error:', error);
      throw new Error('Failed to prepare data for transmission');
    }
  }

  // Verify and extract transmitted data
  extractFromTransmission(transmissionData) {
    try {
      const { payload, integrity, timestamp } = transmissionData;
      
      // Verify integrity
      if (!this.validateIntegrity(payload, integrity)) {
        throw new Error('Data integrity check failed');
      }
      
      // Check timestamp (optional: implement expiration logic)
      const currentTime = Date.now();
      const maxAge = 5 * 60 * 1000; // 5 minutes
      
      if (currentTime - timestamp > maxAge) {
        throw new Error('Data has expired');
      }
      
      // Decrypt and extract data
      const decryptedPayload = this.decrypt(payload);
      return decryptedPayload.data;
    } catch (error) {
      console.error('Transmission extraction error:', error);
      throw new Error('Failed to extract transmitted data');
    }
  }

  // Sanitize input data
  sanitizeInput(input) {
    if (typeof input !== 'string') {
      return input;
    }
    
    // Basic XSS prevention
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  // Generate CSRF token
  generateCSRFToken() {
    return this.generateToken(32);
  }

  // Validate CSRF token
  validateCSRFToken(token, storedToken) {
    return token === storedToken;
  }

  // Secure password validation
  validatePasswordStrength(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const score = [
      password.length >= minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar
    ].filter(Boolean).length;
    
    return {
      isValid: score >= 4,
      score: score,
      requirements: {
        minLength: password.length >= minLength,
        hasUpperCase,
        hasLowerCase,
        hasNumbers,
        hasSpecialChar
      }
    };
  }
}

// Create and export a singleton instance
const encryptionService = new EncryptionService();
export default encryptionService;

