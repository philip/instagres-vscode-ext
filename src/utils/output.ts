import * as vscode from 'vscode';

let outputChannel: vscode.OutputChannel | undefined;

/**
 * Get or create the Instagres output channel
 */
export function getOutputChannel(): vscode.OutputChannel {
  if (!outputChannel) {
    outputChannel = vscode.window.createOutputChannel('Instagres');
  }
  return outputChannel;
}

