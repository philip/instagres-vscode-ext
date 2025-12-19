#!/bin/bash

# Development helper script for Instagres VS Code Extension

set -e

echo "🚀 Instagres VS Code Extension - Development Tools"
echo ""

# Function to show usage
usage() {
    echo "Usage: ./dev.sh [command]"
    echo ""
    echo "Commands:"
    echo "  setup      - Install dependencies and compile"
    echo "  compile    - Compile TypeScript"
    echo "  watch      - Watch mode for development"
    echo "  test       - Run tests (opens extension host)"
    echo "  package    - Package extension as VSIX"
    echo "  clean      - Clean build artifacts"
    echo ""
    exit 1
}

# Check if command is provided
if [ $# -eq 0 ]; then
    usage
fi

case "$1" in
    setup)
        echo "📦 Installing dependencies..."
        npm install
        echo "🔨 Compiling TypeScript..."
        npm run compile
        echo "✅ Setup complete! Press F5 in VS Code to test the extension."
        ;;
    
    compile)
        echo "🔨 Compiling TypeScript..."
        npm run compile
        echo "✅ Compilation complete!"
        ;;
    
    watch)
        echo "👀 Starting watch mode..."
        npm run watch
        ;;
    
    test)
        echo "🧪 Testing extension..."
        echo "Press F5 in VS Code to launch Extension Development Host"
        echo "Or run: code --extensionDevelopmentPath=$(pwd)"
        ;;
    
    package)
        echo "📦 Packaging extension..."
        if ! command -v vsce &> /dev/null; then
            echo "Installing @vscode/vsce..."
            npm install -g @vscode/vsce
        fi
        npm run compile
        
        # Check if --pre-release flag is passed
        if [ "$2" = "--pre-release" ]; then
            vsce package --pre-release
            RELEASE_TYPE="pre-release"
        else
            vsce package
            RELEASE_TYPE="stable"
        fi
        
        # Get the actual version from package.json
        VERSION=$(node -p "require('./package.json').version")
        echo "✅ Extension packaged successfully! ($RELEASE_TYPE)"
        echo "Install with: code --install-extension instagres-${VERSION}.vsix"
        ;;
    
    clean)
        echo "🧹 Cleaning build artifacts..."
        rm -rf out/
        rm -rf *.vsix
        echo "✅ Clean complete!"
        ;;
    
    *)
        echo "❌ Unknown command: $1"
        usage
        ;;
esac



