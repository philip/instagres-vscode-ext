import * as vscode from 'vscode';
import { HistoryManager } from './storage/history';
import { createDatabaseCommand } from './commands/createDatabase';
import { showHistoryCommand } from './commands/showHistory';

export function activate(context: vscode.ExtensionContext) {
  console.log('Instagres extension is now active!');

  // Initialize history manager
  const historyManager = new HistoryManager(context);

  // Clean up expired databases on activation
  historyManager.cleanupExpired();

  // Register commands
  const createDbCommand = vscode.commands.registerCommand(
    'instagres.createDatabase',
    () => createDatabaseCommand(context, historyManager)
  );

  const showHistoryCmd = vscode.commands.registerCommand(
    'instagres.showHistory',
    () => showHistoryCommand(context, historyManager)
  );

  // Add commands to subscriptions
  context.subscriptions.push(createDbCommand);
  context.subscriptions.push(showHistoryCmd);
}

export function deactivate() {
  console.log('Instagres extension is now deactivated.');
}