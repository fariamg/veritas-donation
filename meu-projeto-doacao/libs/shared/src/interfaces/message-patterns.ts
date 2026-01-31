/**
 * Message Patterns para comunicação entre microserviços
 * Seguindo padrão: { cmd: 'comando' }
 */

// ==================== USER SERVICE ====================
export const USER_MESSAGE_PATTERNS = {
  // User CRUD
  CREATE_USER: { cmd: 'create_user' },
  FIND_ALL_USERS: { cmd: 'find_all_users' },
  FIND_USER_BY_ID: { cmd: 'find_user_by_id' },
  FIND_USER_BY_EMAIL: { cmd: 'find_user_by_email' },
  FIND_USER_BY_EMAIL_WITH_PASSWORD: { cmd: 'find_user_by_email_with_password' },
  FIND_USER_BY_USERNAME: { cmd: 'find_user_by_username' },
  UPDATE_USER: { cmd: 'update_user' },
  DELETE_USER: { cmd: 'delete_user' },
  HARD_DELETE_USER: { cmd: 'hard_delete_user' },

  // Authentication & Security
  RECORD_FAILED_LOGIN: { cmd: 'record_failed_login' },
  RESET_FAILED_LOGIN_ATTEMPTS: { cmd: 'reset_failed_login_attempts' },
  IS_ACCOUNT_LOCKED: { cmd: 'is_account_locked' },

  // User Events
  USER_CREATED: { cmd: 'user_created' },
  USER_UPDATED: { cmd: 'user_updated' },
  USER_DELETED: { cmd: 'user_deleted' },
} as const;

// ==================== CAMPAIGN SERVICE ====================
export const CAMPAIGN_MESSAGE_PATTERNS = {
  // Campaign CRUD
  CREATE_CAMPAIGN: { cmd: 'create_campaign' },
  FIND_ALL_CAMPAIGNS: { cmd: 'find_all_campaigns' },
  FIND_CAMPAIGN_BY_ID: { cmd: 'find_campaign_by_id' },
  UPDATE_CAMPAIGN: { cmd: 'update_campaign' },
  DELETE_CAMPAIGN: { cmd: 'delete_campaign' },

  // Campaign Events
  CAMPAIGN_CREATED: { cmd: 'campaign_created' },
  CAMPAIGN_UPDATED: { cmd: 'campaign_updated' },
} as const;

// ==================== PAYMENT SERVICE ====================
export const PAYMENT_MESSAGE_PATTERNS = {
  // Payment CRUD
  CREATE_PAYMENT: { cmd: 'create_payment' },
  FIND_ALL_PAYMENTS: { cmd: 'find_all_payments' },
  FIND_PAYMENT_BY_ID: { cmd: 'find_payment_by_id' },

  // Payment Events
  PAYMENT_CREATED: { cmd: 'payment_created' },
  PAYMENT_CONFIRMED: { cmd: 'payment_confirmed' },
} as const;

// ==================== NOTIFICATION SERVICE ====================
export const NOTIFICATION_MESSAGE_PATTERNS = {
  // Notifications
  SEND_EMAIL: { cmd: 'send_email' },
  SEND_PUSH: { cmd: 'send_push' },

  // Notification Events
  NOTIFICATION_SENT: { cmd: 'notification_sent' },
} as const;
