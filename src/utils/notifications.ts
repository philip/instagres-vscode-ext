import * as vscode from 'vscode';

export async function showProgress<T>(
  title: string,
  task: () => Promise<T>
): Promise<T> {
  return await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title,
      cancellable: false,
    },
    async () => {
      return await task();
    }
  );
}

export function showSuccessMessage(
  message: string,
  ...actions: string[]
): Thenable<string | undefined> {
  return vscode.window.showInformationMessage(message, ...actions);
}

export function showErrorMessage(message: string): Thenable<string | undefined> {
  return vscode.window.showErrorMessage(message);
}