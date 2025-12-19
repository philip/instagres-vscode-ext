import * as vscode from 'vscode';

export async function copyToClipboard(text: string): Promise<void> {
  await vscode.env.clipboard.writeText(text);
}

export async function openUrl(url: string): Promise<void> {
  await vscode.env.openExternal(vscode.Uri.parse(url));
}