// Audit Service
// Handles audit logging, user activity tracking, and compliance monitoring

import authService from './authService';
import encryptionService from './encryptionService';

class AuditService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
    this.auditQueue = [];
    this.maxQueueSize = 100;
    this.flushInterval = 30000; // 30 seconds
    this.isOnline = navigator.onLine;
    
    // Start periodic flush
    this.startPeriodicFlush();
    
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.flushAuditQueue();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  // Log user action
  async logAction(action, details = {}) {
    try {
      const user = authService.getCurrentUser();
      const auditEntry = {
        id: this.generateAuditId(),
        timestamp: new Date().toISOString(),
        userId: user?.id || 'anonymous',
        userName: user?.name || 'Anonymous User',
        userRole: user?.role || 'unknown',
        action: action,
        details: details,
        sessionId: this.getSessionId(),
        ipAddress: await this.getClientIP(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        referrer: document.referrer
      };

      // Add to queue for batch processing
      this.addToQueue(auditEntry);
      
      // Also store locally for offline capability
      this.storeLocalAudit(auditEntry);
      
      return auditEntry.id;
    } catch (error) {
      console.error('Audit logging error:', error);
      return null;
    }
  }

  // Log authentication events
  async logAuth(event, details = {}) {
    const authDetails = {
      event: event,
      timestamp: new Date().toISOString(),
      ...details
    };
    
    return await this.logAction('AUTH', authDetails);
  }

  // Log data access events
  async logDataAccess(resource, operation, details = {}) {
    const accessDetails = {
      resource: resource,
      operation: operation,
      timestamp: new Date().toISOString(),
      ...details
    };
    
    return await this.logAction('DATA_ACCESS', accessDetails);
  }

  // Log system events
  async logSystem(event, details = {}) {
    const systemDetails = {
      event: event,
      timestamp: new Date().toISOString(),
      ...details
    };
    
    return await this.logAction('SYSTEM', systemDetails);
  }

  // Log security events
  async logSecurity(event, details = {}) {
    const securityDetails = {
      event: event,
      severity: details.severity || 'medium',
      timestamp: new Date().toISOString(),
      ...details
    };
    
    return await this.logAction('SECURITY', securityDetails);
  }

  // Log business events
  async logBusiness(event, details = {}) {
    const businessDetails = {
      event: event,
      timestamp: new Date().toISOString(),
      ...details
    };
    
    return await this.logAction('BUSINESS', businessDetails);
  }

  // Add audit entry to queue
  addToQueue(auditEntry) {
    this.auditQueue.push(auditEntry);
    
    // Flush if queue is full
    if (this.auditQueue.length >= this.maxQueueSize) {
      this.flushAuditQueue();
    }
  }

  // Flush audit queue to server
  async flushAuditQueue() {
    if (this.auditQueue.length === 0 || !this.isOnline) {
      return;
    }

    try {
      const entriesToFlush = [...this.auditQueue];
      this.auditQueue = [];

      const response = await fetch(`${this.baseURL}/audit/batch`, {
        method: 'POST',
        headers: authService.getAuthHeaders(),
        body: JSON.stringify({
          entries: entriesToFlush
        }),
      });

      if (!response.ok) {
        // Re-add entries to queue if failed
        this.auditQueue.unshift(...entriesToFlush);
        throw new Error('Failed to flush audit queue');
      }

      console.log(`Flushed ${entriesToFlush.length} audit entries`);
    } catch (error) {
      console.error('Audit queue flush error:', error);
    }
  }

  // Start periodic flush
  startPeriodicFlush() {
    setInterval(() => {
      this.flushAuditQueue();
    }, this.flushInterval);
  }

  // Store audit entry locally
  storeLocalAudit(auditEntry) {
    try {
      const localAudits = this.getLocalAudits();
      localAudits.push(auditEntry);
      
      // Keep only last 1000 entries
      if (localAudits.length > 1000) {
        localAudits.splice(0, localAudits.length - 1000);
      }
      
      encryptionService.encryptLocalStorage('rms_audit_log', localAudits);
    } catch (error) {
      console.error('Local audit storage error:', error);
    }
  }

  // Get local audit entries
  getLocalAudits() {
    try {
      return encryptionService.decryptLocalStorage('rms_audit_log') || [];
    } catch (error) {
      console.error('Local audit retrieval error:', error);
      return [];
    }
  }

  // Generate unique audit ID
  generateAuditId() {
    return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Get session ID
  getSessionId() {
    let sessionId = sessionStorage.getItem('rms_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('rms_session_id', sessionId);
    }
    return sessionId;
  }

  // Get client IP address (approximate)
  async getClientIP() {
    try {
      // In a real application, you might use a service to get the actual IP
      // For now, return a placeholder
      return 'client_ip_placeholder';
    } catch (error) {
      return 'unknown';
    }
  }

  // Search audit logs
  async searchAuditLogs(criteria) {
    try {
      const response = await fetch(`${this.baseURL}/audit/search`, {
        method: 'POST',
        headers: authService.getAuthHeaders(),
        body: JSON.stringify(criteria),
      });

      if (!response.ok) {
        throw new Error('Failed to search audit logs');
      }

      return await response.json();
    } catch (error) {
      console.error('Audit search error:', error);
      return { success: false, error: error.message };
    }
  }

  // Generate audit report
  async generateAuditReport(startDate, endDate, filters = {}) {
    try {
      const response = await fetch(`${this.baseURL}/audit/report`, {
        method: 'POST',
        headers: authService.getAuthHeaders(),
        body: JSON.stringify({
          startDate,
          endDate,
          filters
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate audit report');
      }

      return await response.json();
    } catch (error) {
      console.error('Audit report generation error:', error);
      return { success: false, error: error.message };
    }
  }

  // Track page view
  trackPageView(page) {
    this.logAction('PAGE_VIEW', {
      page: page,
      timestamp: new Date().toISOString()
    });
  }

  // Track user interaction
  trackInteraction(element, action) {
    this.logAction('USER_INTERACTION', {
      element: element,
      action: action,
      timestamp: new Date().toISOString()
    });
  }

  // Track form submission
  trackFormSubmission(formName, success = true) {
    this.logAction('FORM_SUBMISSION', {
      formName: formName,
      success: success,
      timestamp: new Date().toISOString()
    });
  }

  // Track API calls
  trackAPICall(endpoint, method, status) {
    this.logAction('API_CALL', {
      endpoint: endpoint,
      method: method,
      status: status,
      timestamp: new Date().toISOString()
    });
  }

  // Track errors
  trackError(error, context = {}) {
    this.logAction('ERROR', {
      error: error.message || error,
      stack: error.stack,
      context: context,
      timestamp: new Date().toISOString()
    });
  }

  // Get audit statistics
  async getAuditStatistics(period = '24h') {
    try {
      const response = await fetch(`${this.baseURL}/audit/statistics?period=${period}`, {
        method: 'GET',
        headers: authService.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to get audit statistics');
      }

      return await response.json();
    } catch (error) {
      console.error('Audit statistics error:', error);
      return { success: false, error: error.message };
    }
  }

  // Clear local audit logs
  clearLocalAudits() {
    try {
      localStorage.removeItem('rms_audit_log');
      return true;
    } catch (error) {
      console.error('Clear local audits error:', error);
      return false;
    }
  }
}

// Create and export a singleton instance
const auditService = new AuditService();
export default auditService;

