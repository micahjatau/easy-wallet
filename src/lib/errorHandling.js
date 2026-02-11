// Centralized error handling utilities

export const ERROR_CODES = {
  NETWORK: 'network',
  PERMISSION: 'permission',
  OFFLINE: 'offline',
  NOT_CONFIGURED: 'not_configured',
  QUOTA_EXCEEDED: 'quota_exceeded',
  TIMEOUT: 'timeout',
  UNKNOWN: 'unknown',
}

export const categorizeError = (error) => {
  if (!error) return { code: ERROR_CODES.UNKNOWN, message: 'Unknown error' }
  
  const message = error.message || String(error)
  const code = error.code || ''
  
  // Firebase/Firestore errors
  if (code === 'permission-denied' || message.includes('permission')) {
    return {
      code: ERROR_CODES.PERMISSION,
      message: 'Permission denied. Please check your account access.',
      action: 'signout',
    }
  }
  
  if (code === 'unauthenticated' || message.includes('auth') || message.includes('Not authenticated')) {
    return {
      code: ERROR_CODES.PERMISSION,
      message: 'Please sign in to continue.',
      action: 'signin',
    }
  }
  
  if (code === 'not-found' || message.includes('not configured')) {
    return {
      code: ERROR_CODES.NOT_CONFIGURED,
      message: 'Service not configured. Please contact support.',
    }
  }
  
  if (code === 'resource-exhausted' || message.includes('quota') || message.includes('exceeded')) {
    return {
      code: ERROR_CODES.QUOTA_EXCEEDED,
      message: 'Storage quota exceeded. Please free up space or try again later.',
      action: 'cleanup',
    }
  }
  
  if (code === 'deadline-exceeded' || code === 'timeout' || message.includes('timeout')) {
    return {
      code: ERROR_CODES.TIMEOUT,
      message: 'Request timed out. Please try again.',
      action: 'retry',
    }
  }
  
  // Network errors
  if (
    code === 'unavailable' ||
    code === 'network-error' ||
    message.includes('network') ||
    message.includes('offline') ||
    message.includes('ECONNREFUSED') ||
    message.includes('Failed to fetch') ||
    message.includes('NetworkError')
  ) {
    return {
      code: ERROR_CODES.NETWORK,
      message: 'Network connection failed. Please check your internet connection.',
      action: 'retry',
    }
  }
  
  // Default
  return {
    code: ERROR_CODES.UNKNOWN,
    message: message || 'An unexpected error occurred',
    action: 'retry',
  }
}

export const getErrorAction = (errorCategory) => {
  const actions = {
    [ERROR_CODES.PERMISSION]: 'Please check your account permissions or sign in again.',
    [ERROR_CODES.NETWORK]: 'Please check your connection and try again.',
    [ERROR_CODES.OFFLINE]: 'You can continue working offline. Changes will sync when you reconnect.',
    [ERROR_CODES.QUOTA_EXCEEDED]: 'Consider deleting old snapshots or clearing audit logs.',
    [ERROR_CODES.TIMEOUT]: 'Please try again in a moment.',
    [ERROR_CODES.UNKNOWN]: 'If this persists, please contact support.',
  }
  
  return actions[errorCategory.code] || actions[ERROR_CODES.UNKNOWN]
}

export const formatErrorForUser = (error, context = '') => {
  const category = categorizeError(error)
  const prefix = context ? `${context}: ` : ''
  const action = getErrorAction(category)
  
  return {
    title: `${prefix}${category.message}`,
    description: action,
    code: category.code,
    action: category.action,
    raw: error,
  }
}
