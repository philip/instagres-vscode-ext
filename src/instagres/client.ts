import { v4 as uuidv4 } from 'uuid';
import { INSTAGRES_URLS } from './constants';
import { DatabaseInfo, NetworkException, InvalidResponseException } from './types';

export class InstagresClient {
  /**
   * Create a claimable Neon database
   */
  static async createClaimableDatabase(
    referrer: string = 'vscode-instagres',
    dbId?: string
  ): Promise<DatabaseInfo> {
    // Auto-generate UUID if not provided
    if (!dbId) {
      dbId = uuidv4();
    }

    // Step 1: Create the database with POST request
    const createUrl = INSTAGRES_URLS.CREATE_DATABASE_POST(dbId, referrer);

    try {
      const createResponse = await fetch(createUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!createResponse.ok) {
        throw new NetworkException(
          `Failed to create database. HTTP status: ${createResponse.status}`
        );
      }
    } catch (error) {
      if (error instanceof NetworkException) {
        throw error;
      }
      throw new NetworkException(`HTTP request failed: ${error}`);
    }

    // Step 2: Retrieve the database connection info with GET request
    const getUrl = INSTAGRES_URLS.GET_DATABASE_DATA(dbId);

    try {
      const getResponse = await fetch(getUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!getResponse.ok) {
        throw new NetworkException(
          `Failed to retrieve database information. HTTP status: ${getResponse.status}`
        );
      }

      const dbInfo: any = await getResponse.json();

      if (!dbInfo || typeof dbInfo !== 'object') {
        throw new InvalidResponseException('Invalid JSON response from API');
      }

      if (!dbInfo.connection_string) {
        throw new InvalidResponseException('API response missing connection_string field');
      }

      if (!dbInfo.expires_at) {
        throw new InvalidResponseException('API response missing expires_at field');
      }

      // The API returns one connection string, we derive both pooled and direct from it
      const connectionString = dbInfo.connection_string;
      const { pooler, direct } = this.getConnectionStrings(connectionString);

      return {
        connection_string: pooler,
        direct_connection_string: direct,
        claim_url: this.getClaimUrl(dbId),
        expires_at: dbInfo.expires_at,
      };
    } catch (error) {
      if (error instanceof NetworkException || error instanceof InvalidResponseException) {
        throw error;
      }
      throw new NetworkException(`HTTP request failed: ${error}`);
    }
  }

  /**
   * Get the claim URL for a database
   */
  static getClaimUrl(dbId: string): string {
    return INSTAGRES_URLS.CLAIM_DATABASE(dbId);
  }

  /**
   * Derive pooled and direct connection strings from a connection string
   * Based on: https://github.com/neondatabase/neon-pkgs/blob/main/packages/get-db/src/lib/utils/format.ts
   */
  static getConnectionStrings(connString: string): { pooler: string; direct: string } {
    const isPooler = connString.includes('-pooler');
    
    if (isPooler) {
      // Connection string is already pooled, derive direct
      const [first, ...rest] = connString.split('.');
      const directFirst = first.replace('-pooler', '');
      const direct = [directFirst, ...rest].join('.');
      
      return {
        pooler: connString,
        direct: direct,
      };
    } else {
      // Connection string is direct, derive pooled
      const [start, ...end] = connString.split('.');
      const pooler = `${start}-pooler.${end.join('.')}`;
      
      return {
        pooler: pooler,
        direct: connString,
      };
    }
  }
}