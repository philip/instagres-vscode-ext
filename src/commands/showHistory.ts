import * as vscode from 'vscode';
import { HistoryManager } from '../storage/history';
import { DatabaseRecord } from '../instagres/types';
import { copyToClipboard, openUrl } from '../utils/clipboard';
import { getOutputChannel } from '../utils/output';

interface DatabaseQuickPickItem extends vscode.QuickPickItem {
  db: DatabaseRecord;
}

export async function showHistoryCommand(
  context: vscode.ExtensionContext,
  historyManager: HistoryManager
): Promise<void> {
  // Get all databases (including expired)
  const history = await historyManager.getHistory();

  if (history.length === 0) {
    vscode.window.showInformationMessage(
      'No database history found. Create a database first!'
    );
    return;
  }

  // Create QuickPick items
  const items: DatabaseQuickPickItem[] = history.map((db) => {
    const expiresAt = new Date(db.expiresAt);
    const now = new Date();
    const isExpired = expiresAt < now;
    
    const label = isExpired 
      ? `$(error) Expired - ${db.id.substring(0, 8)}...`
      : `$(database) ${db.id.substring(0, 8)}...`;
    
    const expirationText = isExpired
      ? `Expired on ${expiresAt.toLocaleString()}`
      : `Expires ${expiresAt.toLocaleString()}`;

    return {
      label,
      description: expirationText,
      detail: db.connectionString,
      db: db,
    };
  });

  // Show QuickPick
  const selected = await vscode.window.showQuickPick(items, {
    placeHolder: 'Select a database to view details',
    matchOnDescription: true,
    matchOnDetail: true,
  });

  if (!selected) {
    return;
  }

  // Get the database record
  const db = selected.db;

  // Show actions for the selected database
  const action = await vscode.window.showQuickPick(
    [
      'Copy Pooled Connection',
      'Copy Direct Connection',
      'Copy Claim URL',
      'Open Claim URL',
      'Show Full Details',
    ],
    {
      placeHolder: 'What would you like to do?',
    }
  );

  if (!action) {
    return;
  }

  switch (action) {
    case 'Copy Pooled Connection':
      await copyToClipboard(db.connectionString);
      vscode.window.showInformationMessage('Pooled connection string copied to clipboard!');
      break;

    case 'Copy Direct Connection':
      await copyToClipboard(db.directConnectionString);
      vscode.window.showInformationMessage('Direct connection string copied to clipboard!');
      break;

    case 'Copy Claim URL':
      await copyToClipboard(db.claimUrl);
      vscode.window.showInformationMessage('Claim URL copied to clipboard!');
      break;

    case 'Open Claim URL':
      await openUrl(db.claimUrl);
      break;

    case 'Show Full Details':
      const outputChannel = getOutputChannel();
      outputChannel.clear();
      outputChannel.appendLine('Database Details\n');
      outputChannel.appendLine(`ID: ${db.id}`);
      outputChannel.appendLine(`\n📦 Pooled Connection (Recommended for serverless/edge):`);
      outputChannel.appendLine(`   ${db.connectionString}\n`);
      outputChannel.appendLine(`🔗 Direct Connection (For long-running processes):`);
      outputChannel.appendLine(`   ${db.directConnectionString}\n`);
      outputChannel.appendLine(`🌐 Claim URL: ${db.claimUrl}\n`);
      outputChannel.appendLine(`📅 Created: ${new Date(db.createdAt).toLocaleString()}`);
      outputChannel.appendLine(`⏰ Expires: ${new Date(db.expiresAt).toLocaleString()}\n`);
      outputChannel.appendLine('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      outputChannel.appendLine('ℹ️  Connection Types:');
      outputChannel.appendLine('   • Pooled: Best for serverless, edge functions, high concurrency');
      outputChannel.appendLine('   • Direct: Best for long-running apps, migrations, admin tools\n');
      
      const isExpired = new Date(db.expiresAt) < new Date();
      if (isExpired) {
        outputChannel.appendLine('❌ This database has expired and is no longer accessible.');
      } else {
        outputChannel.appendLine('⚠️  Remember to claim this database before it expires!');
      }
      outputChannel.show();
      break;
  }
}
