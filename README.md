# Instagres for VS Code

Create instant [Neon](https://neon.com) PostgreSQL databases directly from VS Code — **no account or signup required**. Perfect for development, testing, prototyping, and learning. 

Alternatively, visit [neon.new](https://neon.new) to create databases without this extension.

## Features

- 🚀 **Instant database creation** - PostgreSQL databases in seconds, no account needed
- 🌐 **Quick access** - Copy connections and open claim URLs with one click
- 📚 **Database history** - Track all your created databases
- ⏱️ **Expiration tracking** - See when databases will expire (72 hours)
- 🔧 **Zero configuration** - Works immediately after installation

## Installation

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)
3. Search for "Instagres"
4. Click Install

Or install from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=philip-projects.instagres).

## Usage

### Create a Database

1. Open Command Palette (Ctrl+Shift+P / Cmd+Shift+P)
2. Type `Instagres: Create Database`
3. Use the quick action buttons:
   - **Copy Pooled** (recommended for serverless/edge)
   - **Copy Direct** (for long-running apps)
   - **Open Claim** (to claim the database)
   - **More...** (additional options)

**Note:** If you don't see notification buttons, check that VS Code's "Do Not Disturb" mode is off (bell icon in status bar).

### View History

1. Open Command Palette
2. Type `Instagres: Show Database History`
3. Select a database and choose an action

## Connection Types

Each database provides **two connection strings**:

### Pooled Connection (Recommended)
```
postgresql://user:pass@ep-xxx-pooler.region.aws.neon.tech/db?sslmode=require
```
- **Best for:** Serverless functions, edge functions, high concurrency
- Uses connection pooling for better performance

### Direct Connection
```
postgresql://user:pass@ep-xxx.region.aws.neon.tech/db?sslmode=require
```
- **Best for:** Long-running apps, migrations, admin tools
- Direct PostgreSQL connection

**Compatible with:** Node.js (pg, Prisma, Drizzle), Python (psycopg2, Django), Go, Ruby, and any PostgreSQL client.

## Claiming Your Database

Databases expire after **72 hours** unless claimed:

1. Click **Open Claim** or copy the claim URL
2. Sign in to Neon (free account)
3. Click to claim the database
4. Now it's permanent! 

## FAQ

**Q: Do I need a Neon account?**  
A: No! Databases are created instantly without any account.

**Q: How long do databases last?**  
A: 72 hours. Claim them to make permanent.

**Q: Is this free?**  
A: Yes! Uses Neon's free tier (PostgreSQL 17, 0.5 GB storage).

**Q: How do I disable history?**  
A: Settings → Search "Instagres" → Uncheck `keepHistory`

## Links

- [Instagres Documentation](https://neon.com/docs/reference/instagres)
- [Source Code](https://github.com/philip/instagres-vscode-ext)
- [Issues](https://github.com/philip/instagres-vscode-ext/issues)

## License

Apache License 2.0 - see [LICENSE](LICENSE) file for details.

---

Powered by [Neon](https://neon.com) - Serverless PostgreSQL
