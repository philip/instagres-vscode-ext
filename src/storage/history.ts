import * as vscode from 'vscode';
import { DatabaseRecord } from '../instagres/types';

const HISTORY_KEY = 'instagres.databaseHistory';
const MAX_HISTORY_SIZE = 50;

export class HistoryManager {
  constructor(private context: vscode.ExtensionContext) {}

  /**
   * Add a database to history
   */
  async addDatabase(database: DatabaseRecord): Promise<void> {
    const config = vscode.workspace.getConfiguration('instagres');
    const keepHistory = config.get<boolean>('keepHistory', true);

    if (!keepHistory) {
      return;
    }

    const history = await this.getHistory();
    
    // Add to beginning of array
    history.unshift(database);

    // Limit history size
    if (history.length > MAX_HISTORY_SIZE) {
      history.splice(MAX_HISTORY_SIZE);
    }

    await this.context.globalState.update(HISTORY_KEY, history);
  }

  /**
   * Get all database history
   */
  async getHistory(): Promise<DatabaseRecord[]> {
    const history = this.context.globalState.get<DatabaseRecord[]>(HISTORY_KEY, []);
    return history;
  }

  /**
   * Get recent databases (not expired)
   */
  async getRecentDatabases(): Promise<DatabaseRecord[]> {
    const history = await this.getHistory();
    const now = new Date();
    
    return history.filter((db) => {
      const expiresAt = new Date(db.expiresAt);
      return expiresAt > now;
    });
  }

  /**
   * Clear all history
   */
  async clearHistory(): Promise<void> {
    await this.context.globalState.update(HISTORY_KEY, []);
  }

  /**
   * Remove expired databases from history
   */
  async cleanupExpired(): Promise<void> {
    const recent = await this.getRecentDatabases();
    await this.context.globalState.update(HISTORY_KEY, recent);
  }
}