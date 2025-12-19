// API response format (snake_case matches Instagres API)
export interface DatabaseInfo {
  connection_string: string;
  direct_connection_string: string;
  claim_url: string;
  expires_at: string;
}

// Internal storage format (camelCase follows TypeScript conventions)
export interface DatabaseRecord {
  id: string;
  connectionString: string;
  directConnectionString: string;
  claimUrl: string;
  expiresAt: string;
  createdAt: string;
}

export class InstagresException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InstagresException';
  }
}

export class NetworkException extends InstagresException {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkException';
  }
}

export class InvalidResponseException extends InstagresException {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidResponseException';
  }
}