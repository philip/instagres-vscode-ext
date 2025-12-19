import * as vscode from 'vscode';
import { InstagresClient } from '../instagres/client';
import { InstagresException, DatabaseInfo } from '../instagres/types';
import { showProgress, showSuccessMessage, showErrorMessage } from '../utils/notifications';
import { copyToClipboard, openUrl } from '../utils/clipboard';
import { getOutputChannel } from '../utils/output';
import { HistoryManager } from '../storage/history';

export async function createDatabaseCommand(
  context: vscode.ExtensionContext,
  historyManager: HistoryManager
): Promise<void> {
  try {
    // Create database with progress indicator
    const database = await showProgress('Creating Instagres database...', async () => {
      return await InstagresClient.createClaimableDatabase('vscode-instagres');
    });

    // Save to history
    await historyManager.addDatabase({
      id: extractDbIdFromClaimUrl(database.claim_url),
      connectionString: database.connection_string,
      directConnectionString: database.direct_connection_string,
      claimUrl: database.claim_url,
      expiresAt: database.expires_at,
      createdAt: new Date().toISOString(),
    });

    // Format expiration time
    const expiresAt = new Date(database.expires_at);
    const expirationMessage = formatExpirationMessage(expiresAt);

    // Show success message with quick actions
    const action = await showSuccessMessage(
      `✅ Database created! ${expirationMessage}`,
      'Copy Pooled',
      'Copy Direct',
      'Open Claim',
      'More...'
    );

    // Handle quick actions
    if (action === 'Copy Pooled') {
      await copyToClipboard(database.connection_string);
      vscode.window.showInformationMessage('Pooled connection copied!');
    } else if (action === 'Copy Direct') {
      await copyToClipboard(database.direct_connection_string);
      vscode.window.showInformationMessage('Direct connection copied!');
    } else if (action === 'Open Claim') {
      await openUrl(database.claim_url);
    } else if (action === 'More...') {
      // Show additional options
      const moreAction = await vscode.window.showQuickPick(
        ['Copy Claim URL', 'Show Full Details'],
        { placeHolder: 'Additional actions' }
      );
      
      if (moreAction === 'Copy Claim URL') {
        await copyToClipboard(database.claim_url);
        vscode.window.showInformationMessage('Claim URL copied to clipboard!');
      } else if (moreAction === 'Show Full Details') {
        showDatabaseDetails(database);
      }
    }

  } catch (error) {
    if (error instanceof InstagresException) {
      await showErrorMessage(`Failed to create database: ${error.message}`);
    } else {
      await showErrorMessage(`Failed to create database: ${error}`);
    }
    console.error('Instagres error:', error);
  }
}

function showDatabaseDetails(database: DatabaseInfo) {
  const outputChannel = getOutputChannel();
  outputChannel.clear();
  outputChannel.appendLine('✅ Database Created Successfully!\n');
  outputChannel.appendLine('📦 Pooled Connection (Recommended for serverless/edge):');
  outputChannel.appendLine(`   ${database.connection_string}\n`);
  outputChannel.appendLine('🔗 Direct Connection (For long-running processes):');
  outputChannel.appendLine(`   ${database.direct_connection_string}\n`);
  outputChannel.appendLine(`🌐 Claim URL: ${database.claim_url}\n`);
  outputChannel.appendLine(`⏰ Expires: ${database.expires_at} (72 hours)\n`);
  outputChannel.appendLine('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  outputChannel.appendLine('ℹ️  Connection Types:');
  outputChannel.appendLine('   • Pooled: Best for serverless, edge functions, high concurrency');
  outputChannel.appendLine('   • Direct: Best for long-running apps, migrations, admin tools\n');
  outputChannel.appendLine('⚠️  This database will expire in 72 hours unless claimed!');
  outputChannel.appendLine('   Visit the claim URL to make it permanent.\n');
  outputChannel.show(true);
}

function extractDbIdFromClaimUrl(claimUrl: string): string {
  // Extract UUID from URL like https://neon.new/database/abc-123-def
  const parts = claimUrl.split('/');
  const dbId = parts[parts.length - 1];
  
  if (!dbId) {
    throw new Error('Invalid claim URL: Unable to extract database ID');
  }
  
  return dbId;
}

function formatExpirationMessage(expiresAt: Date): string {
  const now = new Date();
  const diffMs = expiresAt.getTime() - now.getTime();
  const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
  
  if (diffHours < 1) {
    return 'Expires in less than 1 hour';
  } else if (diffHours === 1) {
    return 'Expires in 1 hour';
  } else {
    return `Expires in ${diffHours} hours`;
  }
}