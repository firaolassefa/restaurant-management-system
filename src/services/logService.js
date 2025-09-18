// Log Service
// Handles application logging, debugging, and error tracking

class LogService {
  constructor() {
    this.logLevel = process.env.REACT_APP_LOG_LEVEL || 'info';
    this.maxLogSize = 1000; // Maximum number of logs to keep in memory
    this.logs = [];
    this.logLevels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3,
      trace: 4
    };
    
    // Set up global error handling
    this.setupGlobalErrorHandling();
  }

  // Get current log level numeric value
  getCurrentLogLevel() {
    return this.logLevels[this.logLevel] || this.logLevels.info;
  }

  // Check if log level should be logged
  shouldLog(level) {
    return this.logLevels[level] <= this.getCurrentLogLevel();
  }

  // Create log entry
  createLogEntry(level, message, data = null, context = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      id: this.generateLogId(),
      timestamp,
      level,
      message,
      data,
      context: {
        url: window.location.href,
        userAgent: navigator.userAgent,
        ...context
      }
    };

    // Add to memory logs
    this.addToMemoryLogs(logEntry);
    
    // Store in local storage for persistence
    this.storeLocalLog(logEntry);
    
    return logEntry;
  }

  // Error logging
  error(message, data = null, context = {}) {
    if (!this.shouldLog('error')) return;
    
    const logEntry = this.createLogEntry('error', message, data, context);
    console.error(`[ERROR] ${message}`, data);
    
    // Send critical errors to server immediately
    this.sendToServer(logEntry);
    
    return logEntry;
  }

  // Warning logging
  warn(message, data = null, context = {}) {
    if (!this.shouldLog('warn')) return;
    
    const logEntry = this.createLogEntry('warn', message, data, context);
    console.warn(`[WARN] ${message}`, data);
    
    return logEntry;
  }

  // Info logging
  info(message, data = null, context = {}) {
    if (!this.shouldLog('info')) return;
    
    const logEntry = this.createLogEntry('info', message, data, context);
    console.info(`[INFO] ${message}`, data);
    
    return logEntry;
  }

  // Debug logging
  debug(message, data = null, context = {}) {
    if (!this.shouldLog('debug')) return;
    
    const logEntry = this.createLogEntry('debug', message, data, context);
    console.debug(`[DEBUG] ${message}`, data);
    
    return logEntry;
  }

  // Trace logging
  trace(message, data = null, context = {}) {
    if (!this.shouldLog('trace')) return;
    
    const logEntry = this.createLogEntry('trace', message, data, context);
    console.trace(`[TRACE] ${message}`, data);
    
    return logEntry;
  }

  // Log API requests
  logAPIRequest(method, url, status, duration, data = null) {
    const message = `API ${method} ${url} - ${status} (${duration}ms)`;
    const logData = {
      method,
      url,
      status,
      duration,
      requestData: data
    };
    
    if (status >= 400) {
      this.error(message, logData);
    } else {
      this.info(message, logData);
    }
  }

  // Log user actions
  logUserAction(action, details = {}) {
    this.info(`User Action: ${action}`, details);
  }

  // Log performance metrics
  logPerformance(metric, value, context = {}) {
    this.info(`Performance: ${metric}`, { value, ...context });
  }

  // Log component lifecycle
  logComponentLifecycle(component, event, props = {}) {
    this.debug(`Component ${component}: ${event}`, props);
  }

  // Add log to memory storage
  addToMemoryLogs(logEntry) {
    this.logs.push(logEntry);
    
    // Keep only the most recent logs
    if (this.logs.length > this.maxLogSize) {
      this.logs.shift();
    }
  }

  // Store log in local storage
  storeLocalLog(logEntry) {
    try {
      const localLogs = this.getLocalLogs();
      localLogs.push(logEntry);
      
      // Keep only last 500 logs in local storage
      if (localLogs.length > 500) {
        localLogs.splice(0, localLogs.length - 500);
      }
      
      localStorage.setItem('rms_logs', JSON.stringify(localLogs));
    } catch (error) {
      console.error('Failed to store log locally:', error);
    }
  }

  // Get logs from local storage
  getLocalLogs() {
    try {
      const logs = localStorage.getItem('rms_logs');
      return logs ? JSON.parse(logs) : [];
    } catch (error) {
      console.error('Failed to retrieve local logs:', error);
      return [];
    }
  }

  // Get all logs (memory + local storage)
  getAllLogs() {
    const localLogs = this.getLocalLogs();
    const allLogs = [...localLogs, ...this.logs];
    
    // Remove duplicates and sort by timestamp
    const uniqueLogs = allLogs.filter((log, index, self) => 
      index === self.findIndex(l => l.id === log.id)
    );
    
    return uniqueLogs.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }

  // Filter logs by level
  getLogsByLevel(level) {
    return this.getAllLogs().filter(log => log.level === level);
  }

  // Filter logs by time range
  getLogsByTimeRange(startTime, endTime) {
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    return this.getAllLogs().filter(log => {
      const logTime = new Date(log.timestamp);
      return logTime >= start && logTime <= end;
    });
  }

  // Search logs by message
  searchLogs(searchTerm) {
    const term = searchTerm.toLowerCase();
    return this.getAllLogs().filter(log => 
      log.message.toLowerCase().includes(term) ||
      JSON.stringify(log.data).toLowerCase().includes(term)
    );
  }

  // Send log to server
  async sendToServer(logEntry) {
    try {
      const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
      
      await fetch(`${baseURL}/logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logEntry),
      });
    } catch (error) {
      console.error('Failed to send log to server:', error);
    }
  }

  // Batch send logs to server
  async sendLogsToServer(logs = null) {
    try {
      const logsToSend = logs || this.getAllLogs();
      const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
      
      await fetch(`${baseURL}/logs/batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ logs: logsToSend }),
      });
      
      this.info('Logs sent to server successfully');
    } catch (error) {
      this.error('Failed to send logs to server', error);
    }
  }

  // Clear all logs
  clearLogs() {
    this.logs = [];
    localStorage.removeItem('rms_logs');
    this.info('All logs cleared');
  }

  // Export logs as JSON
  exportLogs() {
    const logs = this.getAllLogs();
    const dataStr = JSON.stringify(logs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rms-logs-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    this.info('Logs exported successfully');
  }

  // Generate unique log ID
  generateLogId() {
    return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Set up global error handling
  setupGlobalErrorHandling() {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.error('Unhandled Promise Rejection', {
        reason: event.reason,
        promise: event.promise
      });
    });

    // Handle global errors
    window.addEventListener('error', (event) => {
      this.error('Global Error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
      });
    });

    // Handle resource loading errors
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        this.error('Resource Loading Error', {
          element: event.target.tagName,
          source: event.target.src || event.target.href,
          message: 'Failed to load resource'
        });
      }
    }, true);
  }

  // Get log statistics
  getLogStatistics() {
    const logs = this.getAllLogs();
    const stats = {
      total: logs.length,
      byLevel: {},
      byHour: {},
      recentErrors: []
    };

    // Count by level
    logs.forEach(log => {
      stats.byLevel[log.level] = (stats.byLevel[log.level] || 0) + 1;
      
      // Count by hour
      const hour = new Date(log.timestamp).getHours();
      stats.byHour[hour] = (stats.byHour[hour] || 0) + 1;
    });

    // Get recent errors (last 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    stats.recentErrors = logs.filter(log => 
      log.level === 'error' && new Date(log.timestamp) > oneDayAgo
    );

    return stats;
  }

  // Set log level
  setLogLevel(level) {
    if (this.logLevels.hasOwnProperty(level)) {
      this.logLevel = level;
      this.info(`Log level set to: ${level}`);
    } else {
      this.warn(`Invalid log level: ${level}`);
    }
  }
}

// Create and export a singleton instance
const logService = new LogService();
export default logService;

